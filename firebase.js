// Nest Firebase Setup 🏡

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// Your Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyBB6qmVz7nG3e1gLm_8eIfVMCGuvOBcs1g",

    authDomain: "nest-4d28a.firebaseapp.com",

    projectId: "nest-4d28a",

    storageBucket: "nest-4d28a.firebasestorage.app",

    messagingSenderId: "538685748091",

    appId: "1:538685748091:web:a91bccdcc67e57be1603de"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);


// Authentication

export const auth = getAuth(app);


// Database

export const db = getFirestore(app);