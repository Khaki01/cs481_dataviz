alert("If you see this alert, then your custom JavaScript script has run!");

let button = document.getElementById("battery-body");

button.addEventListener("click", function () {
  button.style.height = "50%";
});
