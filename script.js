// =======================
// Firebase config
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyB8wTurqBUONktr4f4JpUgiZb1f3SiaKys",
  authDomain: "christina-baptism.firebaseapp.com",
  projectId: "christina-baptism",
  messagingSenderId: "392226867008",
  appId: "1:392226867008:web:7dfd74a8d05c325887dca5"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log("Firebase connected ✅");

// =======================
// Cloudinary upload
// =======================
async function uploadToCloudinary(file) {
  const CLOUD_NAME = "dhuk7tuu7";        // 👈 άλλαξέ το
  const UPLOAD_PRESET = "wishes_upload"; // 👈 άλλαξέ το

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(url, {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  if (!data.secure_url) {
    throw new Error("Cloudinary upload failed");
  }

  return data.secure_url;
}

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
    const photoUrls = [];

    // 📸 Upload photos FIRST (Cloudinary)
    for (const file of photosInput.files) {
      const url = await uploadToCloudinary(file);
      photoUrls.push(url);
    }

    // 💌 Save wish
    await db.collection("wishes").add({
      name: nameInput.value,
      message: messageInput.value,
      photos: photoUrls,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Η ευχή καταχωρήθηκε 💕");
    form.reset();

  } catch (err) {
    console.error(err);
    alert("Σφάλμα με τη φωτο 😢");
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
              `<img src="${url}" style="width:100%;border-radius:12px;margin-top:8px;">`
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
