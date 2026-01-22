// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB8wTurqBUONktr4f4JpUgiZb1f3SiaKys",
  authDomain: "christina-baptism.firebaseapp.com",
  projectId: "christina-baptism",
  storageBucket: "christina-baptism.appspot.com",
  messagingSenderId: "392226867008",
  appId: "1:392226867008:web:7dfd74a8d05c325887dca5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Services
const db = firebase.firestore();
const storage = firebase.storage();

// ---- TEST ----
console.log("Firebase connected ✅");
