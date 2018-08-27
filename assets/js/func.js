let contactNameInv = document.getElementsByClassName('contactName');
let invDate = document.getElementsByClassName('invDate');
let invTotal = document.getElementsByClassName('total');

let formDate = document.getElementById('formDate');
let formCustomer = document.getElementById('formCustomer');
let formTotal = document.getElementById('totalValue');

//alert('connected')

//file is connected

//console.log(contactNameInv)
let dupeContact = [];
let dupeDate = [];

function checkDupes () {
    for (let i = 0; i < contactNameInv.length; i++){

        //iterate over items and find duplicate contact names
        if (contactNameInv[i].innerText == contactNameInv[i+1].innerText){
            console.log('duplicate customer found')

            dupeContact.push(String(contactNameInv[i].innerText));
            console.log(dupeContact);

            //make contact names red
            contactNameInv[i].bgColor = 'red';
            contactNameInv[i+1].bgColor = 'red';
            //populate form with contact info
            formCustomer.value = contactNameInv[i].innerText;
        }
    
        if (invDate[i].innerText == invDate[i+1].innerText){
            console.log('duplicate date found')
            console.log(invDate[i].innerText);
            
            dupeDate.push(String(invDate[i].innerText))
            console.log(dupeDate);
            
            // mark duplicate dates as red
            invDate[i].bgColor = 'red';
            invDate[i+1].bgColor = 'red';

            //populate form date values
            formDate.value = invDate[i].innerText
            formTotal.value = Number(invTotal[i].innerText) + Number(invTotal[i+1].innerText);

            //change bg to green for values
            invTotal[i].bgColor = 'green';
            invTotal[i+1].bgColor = 'green';
        }
    }
}



// module.exports = {
//     checkDupes
// }