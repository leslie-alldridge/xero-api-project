'use strict';
const util = require('util')
const express = require('express');
const session = require('express-session');
const XeroClient = require('xero-node').AccountingAPIClient;;
const exphbs = require('express-handlebars');

const {formatData} = require('./assets/js/func')

var app = express();

var exbhbsEngine = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: [
        __dirname + '/views/partials/'
    ],
    helpers: {
        ifCond: function(v1, operator, v2, options) {

            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        },
        debug: function(optionalValue) {
            console.log("Current Context");
            console.log("====================");
            console.log(this);

            if (optionalValue) {
                console.log("Value");
                console.log("====================");
                console.log(optionalValue);
            }
        }
    }
});

app.engine('handlebars', exbhbsEngine.engine);

app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(express.logger());
app.use(express.bodyParser());

app.set('trust proxy', 1);
app.use(session({
    secret: 'something crazy',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static(__dirname + '/assets'));

function getXeroClient(session) {
    let config = {};
    try {
        config = require('./config/config.json');
    } catch (ex) {
        if (process && process.env && process.env.APPTYPE) {
            //no config file found, so check the process.env.
            config.appType = process.env.APPTYPE.toLowerCase();
            config.callbackUrl = process.env.authorizeCallbackUrl;
            config.consumerKey = process.env.consumerKey;
            config.consumerSecret = process.env.consumerSecret;
        } else {
            throw "Config not found";
        }
    }

    return new XeroClient(config, session);
}

async function authorizeRedirect(req, res, returnTo) {
    var xeroClient = getXeroClient(req.session);
    let requestToken = await xeroClient.oauth1Client.getRequestToken();

    var authoriseUrl = xeroClient.oauth1Client.buildAuthoriseUrl(requestToken);
    req.session.oauthRequestToken = requestToken;
    req.session.returnTo = returnTo;
    res.redirect(authoriseUrl);
}

function authorizedOperation(req, res, returnTo, callback) {
    if (req.session.accessToken) {
        callback(getXeroClient(req.session.accessToken));
    } else {
        authorizeRedirect(req, res, returnTo);
    }
}

function handleErr(err, req, res, returnTo) {
    console.log(err);
    if (err.data && err.data.oauth_problem && err.data.oauth_problem == "token_rejected") {
        authorizeRedirect(req, res, returnTo);
    } else {
        res.redirect('error', err);
    }
}

app.get('/error', function(req, res) {
    console.log(req.query.error);
    res.render('index', { error: req.query.error });
})

// Home Page
app.get('/', function(req, res) {
     res.redirect('/invoices')
});

// Redirected from xero with oauth results
app.get('/access', async function(req, res) {
    var xeroClient = getXeroClient();

    let savedRequestToken = req.session.oauthRequestToken;
    let oauth_verifier = req.query.oauth_verifier;
    let accessToken = await xeroClient.oauth1Client.swapRequestTokenforAccessToken(savedRequestToken, oauth_verifier);

    req.session.accessToken = accessToken;

    var returnTo = req.session.returnTo;
    res.redirect(returnTo || '/');
});


//view all invoices 
app.get('/invoices', async function(req, res) {
    authorizedOperation(req, res, '/invoices', function(xeroClient) {
        xeroClient.invoices.get(
            { Statuses: 'AUTHORISED' }
        )
            .then(function(result) { 
                res.render('invoices', {
                    invoices: result.Invoices,
                    active: {
                        invoices: true,
                        nav: {
                            accounting: true
                        }
                    }
                });
            })
            .catch(function(err) {
                handleErr(err, req, res, 'invoices');
            })
    })
});

app.post('/filter', function (req, res) {
    res.redirect('/filter')
})

app.get('/filter', function(req, res) {
    authorizedOperation(req, res, '/invoices', function(xeroClient) {
        xeroClient.invoices.get(
            { Statuses: 'AUTHORISED' }
        )
            .then(function(result) {
               
                const names = formatData(result.Invoices)

                //console.log(util.inspect(names, false, null))
                res.render('filter', {
                    names, filter: true
                });
            })
            .catch(function(err) {
                handleErr(err, req, res, 'invoices');
            })
    })
})

app.post('/createinvoice', async function(req, res) { 
    console.log('you made it');
    console.log(req.body.duplicate)
    try {
        authorizedOperation(req, res, '/createinvoice', async function(xeroClient) {
            console.log("you made it here *****")
            var invoice = await xeroClient.invoices.create(
                
                //data object to pass to xero
                {
                Reference: req.body.Reference || '',
                Type: req.body.Type,
                Contact: {
                    Name: req.body.Contact
                },
                Date: req.body.Date, 
                DueDate: req.body.DueDate || '',
                LineItems: [{
                    Description: req.body.Description,
                    Quantity: req.body.Quantity,
                    UnitAmount: req.body.Amount,
                    AccountCode: req.body.AccountCode || '',
                    ItemCode: req.body.ItemCode || ''
                }],
                Status: req.body.Status
            }
            
        ).then((data) => {
            console.log(invoice);
            res.redirect('invoices')
        })
        })
        
    }
    catch (err) {
        res.render('createinvoice', { outcome: 'Error', err: err })
    }
})

app.post('/status', async function(req, res) {
    authorizedOperation(req, res, '/invoices', function(xeroClient) {
        console.log(req.body);
        let request = req.body.invoiceFilter
        if (request == 'ALL'){
            xeroClient.invoices.get().then(function(result) {
                   
                    
                res.render('invoices', {
                    invoices: result.Invoices,
                    active: {
                        invoices: true,
                        nav: {
                            accounting: true
                        }
                    }
                });
            })
            .catch(function(err) {
                handleErr(err, req, res, 'invoices');
            })
        } else {
        xeroClient.invoices.get(
            { Statuses: request }
        ).then(function(result) {
               
                
            res.render('invoices', {
                invoices: result.Invoices,
                active: {
                    invoices: true,
                    nav: {
                        accounting: true
                    }
                }
            });
        })
        .catch(function(err) {
            handleErr(err, req, res, 'invoices');
        })
}})
})

app.get('/help', async function(req, res) {
    return res.render('help', {help: true});
})

app.get('/createinvoice', async function(req, res) {
    let inv = req.query.inv; 
    let customer = req.query.name;
    let date = req.query.date;
    let total = req.query.total;
    return res.render('createinvoice', {success: true, customer: customer, date: date, total: total});
});

app.use(function(req, res, next) {
    if (req.session)
        delete req.session.returnto;
})

var PORT = process.env.PORT || 3100;

app.listen(PORT);
console.log("listening on http://localhost:" + PORT);
