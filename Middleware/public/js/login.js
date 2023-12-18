// Animations
const registerButton = document.getElementById("register");
const loginButton = document.getElementById("login");
const container = document.getElementById("container");

registerButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

loginButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});
// Check Register Error
const form = document.querySelector("form");
const username = document.getElementById("username");
const usernameError = document.querySelector("#username-error");
const email = document.getElementById("email");
const emailError = document.querySelector("#email-error");
const password = document.getElementById("password");
const passwordError = document.querySelector("#password-error");
const phone = document.getElementById("phone");
const phoneError = document.querySelector("#phone-error");
const dob = document.getElementById("dob");
const dobError = document.querySelector("#dob-error");
const passwordConfirm = document.getElementById("password-confirm");
const passwordConfirmError = document.querySelector("#passwordConfirm-error");



// Show input error message
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = "form-control error";
  const small = formControl.querySelector("small");
  small.innerText = message;
}
// Show success outline
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
  const small = formControl.querySelector("small");
  small.innerText = "";
}

// Check email is valid
function checkEmail(email) {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}

email.addEventListener("input", function () {
  if (!checkEmail(email.value)) {
    emailError.textContent = "*Email is not valid";
  } else {
    emailError.textContent = "";
  }
});

// Check length input user name
username.addEventListener("input", function () {
  if (username.value.length < 8) {
    usernameError.textContent = "*Username must be at least 8 characters.";
  } else if (username.value.length > 20) {
    usernameError.textContent = "*Username must be less than 20 characters.";
  } else {
    usernameError.textContent = "";
  }
});
passwordConfirm.addEventListener("input", function () {
  if (passwordConfirm.value != password.value) {
    passwordConfirmError.textContent = "*Password doesn't match."
  } else if (passwordConfirm.value === password.value) { passwordConfirmError.textContent = "" };
})
// Check length input password
password.addEventListener("input", function () {
  if (password.value.length < 8) {
    passwordError.textContent = "*Password must be at least 8 characters.";
  } else if (password.value.length > 20) {
    passwordError.textContent = "*Password must be less than 20 characters.";
  } else {
    passwordError.textContent = "";
  }
});
phone.addEventListener("input", function () {
  if (phone.value.length < 8 || phone.value.length > 11) {
    phoneError.textContent = "*Phone not valid";
  } else {
    phoneError.textContent = "";
  }
})
dob.addEventListener("input", function () {
  const enteredDate = new Date(dob.value);
  const now = new Date();

  const minAge = 18;
  const maxAge = 65;

  let age = now.getFullYear() - enteredDate.getFullYear();
  if (now < new Date(enteredDate.setFullYear(enteredDate.getFullYear() + minAge))) {
    age--;
  }

  if (age < minAge || age > maxAge) {
    dobError.textContent = "*Age must be between 18 - 65 years old";
  } else {
    dobError.textContent = "";
  }
});
// Check required fields
function checkRequired(inputArr) {
  let isRequired = false;
  inputArr.forEach(function (input) {
    if (input.value.trim() === "") {
      showError(input, `*${getFieldName(input)} is required`);
      isRequired = true;
    } else {
      showSuccess(input);
    }
  });

  return isRequired;
}
let lgForm = document.querySelector(".form-lg");
let lgEmail = document.querySelector(".email-2");
let lgEmailError = document.querySelector(".email-error-2");
let lgPassword = document.querySelector(".password-2");
let lgPasswordError = document.querySelector(".password-error-2");

function showError2(input, message) {
  const formControl2 = input.parentElement;
  formControl2.className = "form-control2 error";
  const small2 = formControl2.querySelector("small");
  small2.innerText = message;
}

function showSuccess2(input) {
  const formControl2 = input.parentElement;
  formControl2.className = "form-control2 success";
  const small2 = formControl2.querySelector("small");
  small2.innerText = "";
}

// Check email is valid
function checkEmail2(lgEmail) {
  const emailRegex2 = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex2.test(lgEmail);
}

lgEmail.addEventListener("input", function () {
  if (!checkEmail2(lgEmail.value)) {
    lgEmailError.textContent = "*Email is not valid";
  } else {
    lgEmailError.textContent = "";
  }
});

// Check length input passwrod
lgPassword.addEventListener("input", function () {
  if (lgPassword.value.length < 8) {
    lgPasswordError.textContent = "*Password must be at least 8 characters.";
  } else if (lgPassword.value.length > 20) {
    lgPasswordError.textContent = "*Password must be less than 20 characters.";
  } else {
    lgPasswordError.textContent = "";
  }
});

function checkRequiredLg(inputArr2) {
  let isRequiredLg = false;
  inputArr2.forEach(function (input) {
    if (input.value.trim() === "") {
      showError2(
        input,
        `Please enter your information.`
      );
      isRequiredLg = true;
    } else {
      showSuccess2(input);
    }
  });

  return isRequiredLg;
}

function getFieldNameLg(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

lgForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!checkRequiredLg([lgEmail, lgPassword])) {
    checkEmail2(lgEmail);
  }
});
$(document).ready(function () {
  $(document).on("ajaxStart", function () {
    showLoadingBackdrop();
  });
  $(document).on("ajaxStop", function () {
    hideLoadingBackdrop();
  });
});
function showLoadingBackdrop() {
  document.getElementById("loadingBackdrop").classList.add("loading-active");
}
function hideLoadingBackdrop() {
  document.getElementById("loadingBackdrop").classList.remove("loading-active");
}
