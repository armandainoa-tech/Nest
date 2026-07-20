// Nest 🏡 Script

import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


import {
    doc,
    setDoc,
    getDoc,
    collection,
    addDoc,
    onSnapshot,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";



// Elements

const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");


const nameInput = document.getElementById("name");

const email = document.getElementById("email");

const password = document.getElementById("password");


const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");


const message = document.getElementById("message");


let currentUser = null;





// CREATE ACCOUNT

signupBtn.addEventListener("click", async()=>{


try{


const userCredential =
await createUserWithEmailAndPassword(
auth,
email.value,
password.value
);



const user = userCredential.user;



await setDoc(

doc(db,"users",user.uid),

{

name:nameInput.value,

email:user.email,

household:"Nest"

}

);



message.innerText =
"Account created 🏡";



}


catch(error){


message.innerText =
error.message;


}



});







// LOGIN


loginBtn.addEventListener("click", async()=>{


try{


await signInWithEmailAndPassword(

auth,

email.value,

password.value

);



}


catch(error){


message.innerText =
error.message;


}



});









// AUTH CHECK


onAuthStateChanged(auth, async(user)=>{


if(user){


currentUser = user;


loginScreen.style.display="none";

appScreen.style.display="block";



const userSnap =
await getDoc(

doc(
db,
"users",
user.uid
)

);



if(userSnap.exists()){


const data =
userSnap.data();



document.getElementById("user-name")
.innerText =
"Welcome, "
+ (data.name || "Armanda");



document.getElementById("account-name")
.innerText =
data.name;


}



loadBills();



}


else{


loginScreen.style.display="block";

appScreen.style.display="none";


}



});









// LOGOUT


document
.getElementById("logout-btn")
.addEventListener("click",()=>{


signOut(auth);


});









// PAGE SWITCHING


function showPage(page){


document
.querySelectorAll(".page")
.forEach(p=>{


p.classList.remove("active");


});


document
.getElementById(page)
.classList.add("active");


}



window.showPage = showPage;









// BILL FORM


const openBill =
document.getElementById("open-bill");


const billForm =
document.getElementById("bill-form");



openBill.addEventListener("click",()=>{


billForm.classList.toggle("hidden");


});









// SAVE BILL


document
.getElementById("save-bill")
.addEventListener("click",async()=>{


const bill = {


name:
document.getElementById("bill-name").value,


amount:
Number(
document.getElementById("bill-amount").value
),


dueDate:
document.getElementById("bill-date").value,


paid:false,


paidBy:
document.getElementById("bill-person").value


};



await addDoc(

collection(

db,

"households",

"Nest",

"bills"

),

bill

);



billForm.classList.add("hidden");


});









// LOAD BILLS


function loadBills(){



const bills = collection(

db,

"households",

"Nest",

"bills"

);



onSnapshot(bills,(snapshot)=>{



const list =
document.getElementById("bill-list");


const upcoming =
document.getElementById("upcoming");


list.innerHTML="";


let remaining = 0;

let upcomingHTML="";



snapshot.forEach((item)=>{


const bill =
item.data();



if(!bill.paid){

remaining += bill.amount;

}



const div =
document.createElement("div");


div.className="bill";



div.innerHTML = `

<h3>${bill.name}</h3>

<p>$${bill.amount}</p>

<p>Due: ${bill.dueDate}</p>

<p>Paid by: ${bill.paidBy}</p>


<button onclick="togglePaid('${item.id}',${bill.paid})">

${bill.paid ? "✅ Paid" : "⬜ Mark Paid"}

</button>


<button onclick="removeBill('${item.id}')">

🗑 Delete

</button>


`;



list.appendChild(div);



upcomingHTML +=

`

<p>
${bill.name} - $${bill.amount}
</p>

`;



});



document.getElementById("remaining")
.innerText =
"$" + remaining.toFixed(2);



upcoming.innerHTML =
upcomingHTML || "No bills yet";



});


}









// MARK PAID


async function togglePaid(id,status){


await updateDoc(

doc(

db,

"households",

"Nest",

"bills",

id

),

{


paid:!status


}

);


}









// DELETE BILL


async function removeBill(id){


await deleteDoc(

doc(

db,

"households",

"Nest",

"bills",

id

)

);


}



window.togglePaid = togglePaid;

window.removeBill = removeBill;