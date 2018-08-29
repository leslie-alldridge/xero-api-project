'use strict';

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
            // console.log("Current Context");
            // console.log("====================");
            // console.log(this);

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
    resave: false,
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
    // res.render('index', {
    //     active: {
    //         overview: true
    //     }
    // });
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
        xeroClient.invoices.get()
            .then(function(result) {
               
                console.log(result.Invoices);
                
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
        xeroClient.invoices.get()
            .then(function(result) {
               
                const names = formatData(result.Invoices)
                console.log(names['TEST'].datesList[0]);
                
                res.render('filter', {
                    names
                    // active: {
                    //     invoices: true,
                    //     nav: {
                    //         accounting: true
                    //     }
                    // }
                });
            })
            .catch(function(err) {
                handleErr(err, req, res, 'invoices');
            })
    })
})

// app.post('/filter', async function(req, res) {
    
//     let requestIntent = req.body.invoiceFilter;
//     console.log(requestIntent);

//     if (requestIntent == 'ALL'){
//         authorizedOperation(req, res, '/invoices', function(xeroClient) {
//             xeroClient.invoices.get()
//                 .then(function(result) {
                   
                    
//                     res.render('invoices', {
//                         invoices: result.Invoices,
//                         active: {
//                             invoices: true,
//                             nav: {
//                                 accounting: true
//                             }
//                         }
//                     });
//                 })
//                 .catch(function(err) {
//                     handleErr(err, req, res, 'invoices');
//                 })
//         })
//     }

//     authorizedOperation(req, res, '/filter', function(xeroClient) {

//         xeroClient.invoices.get(
//             // { where: {Statuses: 'PAID'} }
//             // { where: "Statuses=PAID" }
//             { Statuses: requestIntent }
//         )
        
//             .then(function(result) {
//                 console.info(result + "returned paid invoices %%%%%%%%%");
//                 console.info(result);

                
//                 res.render('invoices', {
//                     invoices: result.Invoices,
//                     active: {
//                         invoices: true,
//                         nav: {
//                             accounting: true
//                         }
//                     }
//                 });
//             })
//             .catch(function(err) {
//                 handleErr(err, req, res, 'invoices');
//             })
//     })
// });

// my attempt to do a post request to Xero and have the invoice display in my org as a draft
// success msg returns but no invoice exists when I login - logs show it's a put request
//docs say :

//The PUT method is similar to the POST Invoices method, 
//however you can only create new invoices with this method.

//api status shows 200 green, my console logged data object is below

//{ Id: '64694a3e-f87f-49c0-8bf1-af5e17681f03',
// Status: 'OK',
// ProviderName: 'Brojects',
// DateTimeUTC: '/Date(1535402834440)/',
// Invoices: 
//  [ { Type: 'ACCREC',
//      InvoiceID: '00000000-0000-0000-0000-000000000000',
//      Payments: [],
//      CreditNotes: [],
//      Prepayments: [],
//      Overpayments: [],
//      HasErrors: true,
//      IsDiscounted: false,
//      Contact: [Object],
//      DateString: '2018-08-28T00:00:00',
//      Date: '/Date(1535414400000+0000)/',
//      DueDateString: '2018-10-10T00:00:00',
//      DueDate: '/Date(1539129600000+0000)/',
//      Status: 'DRAFT',
//      LineAmountTypes: 'Exclusive',
//      LineItems: [Array],
//      SubTotal: 22,
//      TotalTax: 0,
//      Total: 22,
//      CurrencyCode: 'NZD',
//      StatusAttributeString: 'ERROR',
//      ValidationErrors: [Array] } ] }


app.post('/createinvoice', async function(req, res) { 
    console.log('you made it');
    
    try {
        authorizedOperation(req, res, '/createinvoice', async function(xeroClient) {
            console.log("you made it here *****")
            var invoice = await xeroClient.invoices.create(
                
                //data object to pass to xero
                {
            
                Type: req.body.Type,
                Contact: {
                    Name: req.body.Contact
                },
                DueDate: '2018-10-10',
                LineItems: [{
                    Description: req.body.Description,
                    Quantity: req.body.Quantity,
                    UnitAmount: req.body.Amount,
                    AccountCode: 200,
                    ItemCode: ''
                }],
                Status: 'DRAFT'
            }
            
        )
        console.log(invoice);
            res.render('createinvoice', { outcome: 'Invoice created', id: invoice.InvoiceID })
        })
    }
    catch (err) {
        res.render('createinvoice', { outcome: 'Error', err: err })
    }
})

//xero's example, but i had issues using my own forms as their post requests were conflicting with
//the route definition below

app.use('/createinvoice', async function(req, res) {
    if (req.method == 'GET') {
        return res.render('createinvoice');
    } else if (req.method == 'POST') {
        try {
            authorizedOperation(req, res, '/createinvoice', async function(xeroClient) {
                var invoice = await xeroClient.invoices.create({
                    Type: req.body.Type,
                    Contact: {
                        Name: req.body.Contact
                    },
                    DueDate: '2014-10-01',
                    LineItems: [{
                        Description: req.body.Description,
                        Quantity: req.body.Quantity,
                        UnitAmount: req.body.Amount,
                        AccountCode: 400,
                        ItemCode: 'ABC123'
                    }],
                    Status: 'DRAFT'
                });

                res.render('createinvoice', { outcome: 'Invoice created', id: invoice.InvoiceID })

            })
        }
        catch (err) {
            res.render('createinvoice', { outcome: 'Error', err: err })

        }
    }
});

//post request to populate the create invoice page
app.post('/createinvoice2', async function(req, res) { 
    let customer = req.body.customer;
    let date = req.body.date;
    let total = req.body.total;
    return res.render('createinvoice', {customer: customer, date: date, total: total})
})

app.use(function(req, res, next) {
    if (req.session)
        delete req.session.returnto;
})

var PORT = process.env.PORT || 3100;

app.listen(PORT);
console.log("listening on http://localhost:" + PORT);
