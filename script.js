// Nest App Script 🏡

import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


import {
    doc,
    getDoc,
    setDoc,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";




// LOGIN ELEMENTS

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");

const message = document.getElementById("message");

const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");




// CREATE ACCOUNT

signupBtn.addEventListener("click", async () => {

    const email = emailInput.value;
    const password = passwordInput.value;


    try {

        const userCredential =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );


        const user = userCredential.user;


        await setDoc(
            doc(db,"users",user.uid),
            {

                name:"Armanda",

                household:"Nest",

                email:email

            }
        );


        message.innerText =
        "Nest account created 🏡";


    } catch(error){

        message.innerText =
        error.message;

    }

});







// LOGIN

loginBtn.addEventListener("click", async()=>{


    const email = emailInput.value;

    const password = passwordInput.value;



    try{


        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        message.innerText =
        "Welcome back 🏡";


    }catch(error){


        message.innerText =
        error.message;


    }


});









// AUTH CHECK

onAuthStateChanged(auth, async(user)=>{


    if(user){


        loginScreen.style.display="none";

        appScreen.style.display="block";



        const userSnap =
        await getDoc(
            doc(db,"users",user.uid)
        );



        if(userSnap.exists()){


            const data =
            userSnap.data();



            document.getElementById("user-name")
            .innerText =
            "Welcome, "
            + data.name
            + " 🏡";



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


const logoutBtn =
document.getElementById("logout-btn");



if(logoutBtn){


logoutBtn.addEventListener(
"click",
async()=>{


await signOut(auth);


});


}









// OPEN BILL FORM


const openBill =
document.getElementById("open-bill");


const billForm =
document.getElementById("bill-form");



if(openBill){


openBill.addEventListener(
"click",
()=>{


billForm.style.display="block";


});


}









// SAVE BILL


const saveBill =
document.getElementById("save-bill");



if(saveBill){


saveBill.addEventListener(
"click",
async()=>{


const name =
document.getElementById("bill-name").value;


const amount =
document.getElementById("bill-amount").value;


const date =
document.getElementById("bill-date").value;


const person =
document.getElementById("bill-person").value;



await addDoc(

collection(
db,
"households",
"Nest",
"bills"
),

{


name:name,

amount:Number(amount),

dueDate:date,

paid:false,

paidBy:person


}

);



document.getElementById("bill-name").value="";
document.getElementById("bill-amount").value="";
document.getElementById("bill-date").value="";


billForm.style.display="none";


});


}









// LOAD BILLS


function loadBills(){



const billsRef =
collection(
db,
"households",
"Nest",
"bills"
);



const q =
query(
billsRef,
orderBy("dueDate")
);





onSnapshot(q,(snapshot)=>{


const list =
document.getElementById("bill-list");


list.innerHTML="";



snapshot.forEach((item)=>{


const bill =
item.data();



const div =
document.createElement("div");


div.className="bill";



div.innerHTML = `


<h3>${bill.name}</h3>


<p>
$${bill.amount}
</p>


<p>
Due: ${bill.dueDate}
</p>


<p>
Paid by: ${bill.paidBy}
</p>



<button onclick="togglePaid('${item.id}', ${bill.paid})">

${bill.paid ? "✅ Paid" : "⬜ Mark Paid"}

</button>



<button onclick="deleteBill('${item.id}')">

🗑 Delete

</button>


`;



list.appendChild(div);



});


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


async function deleteBill(id){


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








// PAGE SWITCHING


function showPage(page){


document.querySelectorAll(".page")
.forEach(section=>{


section.classList.remove("active");


});



document.getElementById(page)
.classList.add("active");


}



window.showPage = showPage;

window.togglePaid = togglePaid;

window.deleteBill = deleteBill;