// let contactNameInv = document.getElementsByClassName('contactName');
// let invDate = document.getElementsByClassName('invDate');
// let invTotal = document.getElementsByClassName('total');

// let formDate = document.getElementById('formDate');
// let formCustomer = document.getElementById('formCustomer');
// let formTotal = document.getElementById('totalValue');


//testing duplicates 
// var input = contactNameInv;
// console.log(input);

// var duplicates = input.reduce(function(acc, el, i, arr) {
//   if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
// }, []);

// console.log(duplicates);
//  // = 1,3 (actual array == [1, 3])


//alert('connected')

// //file is connected
// let duplicateDatesForContact = [];
// //console.log(contactNameInv)
// let dupeContact = [];
// let dupeDate = [];

// let dateholder = [];


//BELOW IS LAST WORKING12222222222222222222222222

function formatData (apiInfo) {
    // console.log({apiInfo});

    let data = {}
    
    for (let i = 0; i < apiInfo.length; i++) {
        let invoice = apiInfo[i]
        let name = invoice.Contact.Name
        let date = invoice.DateString
        // console.log({invoice});
        
        // console.log({name});
        
        if (!data.hasOwnProperty(name)) data[name] = {
            total: 0,
            name,
            dates: [] //this used to be {}
        }

        if (!data[name]['dates'].hasOwnProperty(date)) {
            data[name]['dates'][date] = {
                total: 0,
                invoices: []
            }  
            console.info(data[name]['dates'][date]); //this logs every time the loop runs, appears to be emptying array of invoices
            
        } 

        data[name].total += Number(invoice.Total)
        data[name]['dates'][date].total += Number(invoice.Total)
        data[name]['dates'][date].invoices.push(invoice) //just pushing inv number for now to reduce log trail
    }
    
    
    let names = Object.keys(data)
    //console.log(names);
    
    names.forEach(name => {
        let dates = Object.keys(data[name].dates)
        data[name].datesList = dates.map(date => {
            //console.log(date);
            
            data[name]['dates'][date].date = date
            return data[name]['dates'][date]
        })
    })
    //console.log(data['lauren'].datesList[0]);
    // console.dir(data);
    
    
    return data
}

// function checkDupes () {
//     //console.log({apiInfo});

//     const data = {}

//     for (let i = 0; i < contactNameInv.length; i++) {
//         const element = contactNameInv[i]
//         const name = element.innerText
//         const row = element.parentNode
//         console.log({row});
//         if (!data.hasOwnProperty(name)) data[name] = {
//             total: 0,
//             dates: {}
//         }

//         const text = Array.from(row.children).map(item => item.innerText)
//         const [invoiceNumber, date, dueDate, status, total] = text

//         if (!data[name].hasOwnProperty(date)) data[name]['dates'][date] = {
//             total: 0,
//             invoices: []
//         }

//         const invoice = {
//             name,
//             date,
//             invoiceNumber,
//             dueDate,
//             status,
//             total
//         }

//         data[name].total += Number(invoice.total)
//         data[name]['dates'][date].total += Number(invoice.total)
//         data[name]['dates'][date].invoices.push(invoice)

       
//     }
//     console.log({data})
//     return data
// } 
//     console.log({data})
// }

// function checkDates(duplicates) {
    
//     for (let i = 0; i < invDate.length; i++){  

//         if (duplicates[1] == contactNameInv[i].innerText){
//             // contactNameInv[i].bgColor = 'red'; makes all of them red without date consideration
//             dateholder.push(invDate[i].innerText)
//             console.log(invTotal[i].innerText + "monnnnney")
//             console.log(dateholder + "these are all ur dates for lauren");
            
//         }
    
//         duplicateDatesForContact = dateholder.reduce(function(acc, el, i, arr) {
//             if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
//         }, []);
    
//           console.log(`these are my ${duplicateDatesForContact} duplicate dates for lauren`);
//     }

//     // for (let i = 0; i < invDate.length; i++){ 
//     //     if (invDate[i] == duplicateDatesForContact[0]){
//     //         console.log(contactNameInv[i])
//     //         console.log(invTotal[i]);
            
//     //     }


//     // }

// }

module.exports = {
    formatData
    // checkDupes
}