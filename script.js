// =======================
// Firebase config
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyB8wTurqBUONktr4f4JpUgiZb1f3SiaKys",
  authDomain: "christina-baptism.firebaseapp.com",
  projectId: "christina-baptism",
  storageBucket: "christina-baptism.appspot.com",
  messagingSenderId: "392226867008",
  appId: "1:392226867008:web:7dfd74a8d05c325887dca5"
};

// =======================
// Initialize Firebase
// =======================
firebase.initializeApp(firebaseConfig);

// =======================
// Services
// =======================
const db = firebase.firestore();

console.log("Firebase connected ✅");

// =======================
// Form submit (ADD WISH)
// =======================
const form = document.getElementById("wishForm");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!nameInput.value || !messageInput.value) return;

  try {
    await db.collection("wishes").add({
      name: nameInput.value,
      message: messageInput.value,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    form.reset();
    alert("Η ευχή σας καταχωρήθηκε 💕");
  } catch (err) {
    console.error(err);
    alert("Κάτι πήγε λάθος 😢");
  }
});

// =======================
// SHOW WISHES (NO orderBy)
// =======================
const wishList = document.getElementById("wishList");

db.collection("wishes").onSnapshot((snapshot) => {
  wishList.innerHTML = "";

  snapshot.forEach((doc) => {
    const wish = doc.data();

    const div = document.createElement("div");
    div.className = "wish";

    div.innerHTML = `
      <strong>${wish.name}</strong>
      <p>${wish.message}</p>
    `;

    wishList.appendChild(div);
  });
});
