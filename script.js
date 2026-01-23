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
  const CLOUD_NAME = "dhuk7tuu7";
  const UPLOAD_PRESET = "wishes_upload";

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
// FORM
// =======================
const form = document.getElementById("wishForm");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const photosInput = document.getElementById("photos");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!nameInput.value || !messageInput.value) return;

  // ⛔ ΟΡΙΟ ΦΩΤΟ
  if (photosInput.files.length > 10) {
    alert("Μέχρι 10 φωτογραφίες ανά ευχή 📸");
    return;
  }

  try {
    const photoUrls = [];

    // 📸 Upload φωτο στο Cloudinary
    for (const file of photosInput.files) {
      const url = await uploadToCloudinary(file);
      photoUrls.push(url);
    }

    // 💌 Αποθήκευση ευχής
    await db.collection("wishes").add({
      name: nameInput.value,
      message: messageInput.value,
      photos: photoUrls,
      createdAt: firebase.firestore.Timestamp.now()
    });

    alert("Η ευχή καταχωρήθηκε 💕");
    form.reset();

  } catch (err) {
    console.error(err);
    alert("Κάτι πήγε στραβά με τις φωτο 😢");
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
          .map((url) => `<img src="${url}" class="wish-photo">`)
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
