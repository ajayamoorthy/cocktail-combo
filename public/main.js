const loginButton = document.querySelector(".show-login");
const closeButton = document.querySelector(".close-button");
const popup = document.querySelector(".form");

loginButton.addEventListener("click", () => {
    popup.classList.add("active");
});

closeButton.addEventListener("click", () => {
    popup.classList.remove("active");
});