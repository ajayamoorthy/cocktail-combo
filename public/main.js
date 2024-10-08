const loginButton = document.querySelector(".show-login");
const closeButton = document.querySelector(".close-button");
const popup = document.querySelector(".form");
const registerButton = document.querySelector(".show-register");
const regPopup = document.querySelector(".register-form");
const password = document.getElementById("password");
const passwordCheckbox = document.getElementById("password-checkbox")

loginButton.addEventListener("click", () => {
    regPopup.classList.remove("active");
    popup.classList.add("active");
    
});

closeButton.addEventListener("click", () => {
    popup.classList.remove("active");
});

registerButton.addEventListener("click", () => {
    popup.classList.remove("active");
    regPopup.classList.add("active");
});

function showPassword() {
    if (passwordCheckbox.checked) {
        password.type = "text";
    }
    else {
        password.type = "password";
    }
}
