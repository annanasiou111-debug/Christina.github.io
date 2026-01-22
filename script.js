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
// Form submit
const form = document.getElementById("wishForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  try {
    await db.collection("wishes").add({
      name: name,
      message: message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Η ευχή σας καταχωρήθηκε 💕");

    form.reset();
  } catch (error) {
    console.error("Σφάλμα:", error);
    alert("Κάτι πήγε λάθος 😢");
  }
});
