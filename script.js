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

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();

console.log("Firebase connected ✅");

// =======================
// Form
// =======================
const form = document.getElementById("wishForm");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const photosInput = document.getElementById("photos");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!nameInput.value || !messageInput.value) return;

  try {
    // 1️⃣ ΑΠΟΘΗΚΕΥΣΗ ΕΥΧΗΣ ΧΩΡΙΣ ΦΩΤΟ
    const docRef = await db.collection("wishes").add({
      name: nameInput.value,
      message: messageInput.value,
      photos: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // 2️⃣ ΑΝ ΥΠΑΡΧΟΥΝ ΦΩΤΟ → UPLOAD
    const photoUrls = [];

    for (const file of photosInput.files) {
      const photoRef = storage
        .ref()
        .child(`photos/${docRef.id}_${file.name}`);

      await photoRef.put(file);
      const url = await photoRef.getDownloadURL();
      photoUrls.push(url);
    }

    // 3️⃣ ΕΝΗΜΕΡΩΣΗ ΕΥΧΗΣ ΜΕ ΦΩΤΟ
    if (photoUrls.length > 0) {
      await docRef.update({
        photos: photoUrls
      });
    }

    alert("Η ευχή καταχωρήθηκε 💕");
    form.reset();

  } catch (err) {
    console.error(err);
    alert("Κάτι πήγε λάθος 😢");
  }
});

// =======================
// ΕΜΦΑΝΙΣΗ ΕΥΧΩΝ
// =======================
const wishList = document.getElementById("wishList");

db.collection("wishes")
  .orderBy("createdAt", "desc")
  .onSnapshot((snapshot) => {
    wishList.innerHTML = "";

    snapshot.forEach((doc) => {
      const wish = doc.data();

      const div = document.createElement("div");
      div.className = "wish";

      let photosHtml = "";
      if (wish.photos && wish.photos.length > 0) {
        photosHtml = wish.photos
          .map(
            (url) =>
              `<img src="${url}" style="width:100%;border-radius:10px;margin-top:8px;">`
          )
          .join("");
      }

      div.innerHTML = `
        <strong>${wish.name}</strong>
        <p>${wish.message}</p>
        ${photosHtml}
      `;

      wishList.appendChild(div);
    });
  });
