const form = document.getElementById("wishForm");
const list = document.getElementById("wishList");

form.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  const div = document.createElement("div");
  div.className = "wish";
  div.innerHTML = `<strong>${name}</strong><br>${message}`;

  list.prepend(div);
  form.reset();
});
