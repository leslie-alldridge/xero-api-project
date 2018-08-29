let contactNameInv = document.getElementsByClassName('contactName');
let invDate = document.getElementsByClassName('invDate');
let invTotal = document.getElementsByClassName('total');

let formDate = document.getElementById('formDate');
let formCustomer = document.getElementById('formCustomer');
let formTotal = document.getElementById('totalValue');


//testing duplicates 
// var input = contactNameInv;
// console.log(input);

// var duplicates = input.reduce(function(acc, el, i, arr) {
//   if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
// }, []);

// console.log(duplicates);
//  // = 1,3 (actual array == [1, 3])


//alert('connected')

//file is connected
let duplicates = [];
let duplicateDatesForContact = [];
//console.log(contactNameInv)
let dupeContact = [];
let dupeDate = [];
let holder = [];

let dateholder = [];

function checkDupes () {
    for (let i = 0; i < contactNameInv.length; i++){

        //this reduces an array for the duplicated contact names
        holder.push(contactNameInv[i].innerText)
        


        duplicates = holder.reduce(function(acc, el, i, arr) {
            if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
        }, []);

          console.log(`these are my ${duplicates} contacts`);
          
        


        //iterate over items and find duplicate contact names
        // if (contactNameInv[i].innerText == contactNameInv[i+1].innerText){
        //     //console.log('duplicate customer found')

        //     dupeContact.push(String(contactNameInv[i].innerText));
        //     //console.log(dupeContact);

        //     //make contact names red
        //     contactNameInv[i].bgColor = 'red';
        //     contactNameInv[i+1].bgColor = 'red';
        //     //populate form with contact info
        //     formCustomer.value = contactNameInv[i].innerText;
        // }
    
        // if (invDate[i].innerText == invDate[i+1].innerText){
        //     //console.log('duplicate date found')
        //     //console.log(invDate[i].innerText);
            
        //     dupeDate.push(String(invDate[i].innerText))
        //     //console.log(dupeDate);
            
        //     // mark duplicate dates as red
        //     invDate[i].bgColor = 'red';
        //     invDate[i+1].bgColor = 'red';

        //     //populate form date values
        //     formDate.value = invDate[i].innerText
        //     // formTotal.value = Number(invTotal[i].innerText) + Number(invTotal[i+1].innerText);

        //     //change bg to green for values
        //     invTotal[i].bgColor = 'green';
        //     invTotal[i+1].bgColor = 'green';
        // }
        
        
    }
    console.log('help2');
    
    checkDates()
}

function checkDates(){
    console.log('help');
    
    for (let i = 0; i < contactNameInv.length; i++){  

        if (duplicates[1] == contactNameInv[i].innerText){
            // contactNameInv[i].bgColor = 'red'; makes all of them red without date consideration
            dateholder.push(invDate[i].innerText)
            console.log(dateholder + "these are all ur dates for lauren");
            
        }
    
        duplicateDatesForContact = dateholder.reduce(function(acc, el, i, arr) {
            if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
        }, []);
    
          console.log(`these are my ${duplicateDatesForContact} duplicate dates for lauren`);
    }
    


}

// module.exports = {
//     checkDupes
// }