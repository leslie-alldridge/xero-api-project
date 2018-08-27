let contactNameInv = document.getElementsByClassName('contactName');
let invDate = document.getElementsByClassName('invDate');
let formDate = document.getElementById('formDate');
let formCustomer = document.getElementById('formCustomer');
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

            contactNameInv[i].bgColor = 'red';
            contactNameInv[i+1].bgColor = 'red';

            formCustomer.value = contactNameInv[i].innerText;
        }
    
        if (invDate[i].innerText == invDate[i+1].innerText){
            console.log('duplicate date found')
            console.log(invDate[i].innerText);
            
            dupeDate.push(String(invDate[i].innerText))
            console.log(dupeDate);
            

            invDate[i].bgColor = 'red';
            invDate[i+1].bgColor = 'red';
            formDate.value = invDate[i].innerText
        }
    }
}



// module.exports = {
//     checkDupes
// }