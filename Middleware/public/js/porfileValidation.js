// porfileValidation.js

document.addEventListener("DOMContentLoaded", function () {
    const userNameInput = document.getElementById("userNameInput");
    const phoneInput = document.getElementById("phone");
    const dobInput = document.getElementById("dob");
    const formFileInput = document.getElementById("formFile");

    const userNameValidation = document.getElementById("userNameValidation");
    const phoneValidation = document.getElementById("phoneValidation");
    const dobValidation = document.getElementById("dobValidation");

    // Use 'input' event for immediate validation
    userNameInput.addEventListener("input", function () {
        validateUserName();
    });

    phoneInput.addEventListener("input", function () {
        validatePhone();
    });

    dobInput.addEventListener("input", function () {
        validateDOB();
    });

    function validateUserName() {
        if (userNameInput.value.trim() === "") {
            showError(userNameInput, userNameValidation, "Username is required.");
        } else {
            showSuccess(userNameInput, userNameValidation);
        }
    }

    function validatePhone() {
        if (phoneInput.value.trim() === "") {
            showError(phoneInput, phoneValidation, "Phone is required.");
        } else {
            showSuccess(phoneInput, phoneValidation);
        }
    }

    function validateDOB() {
        const enteredDOB = new Date(dobInput.value);
        const currentDate = new Date();
        const age = calculateAge(enteredDOB, currentDate);

        if (age < 18 || age > 65) {
            showError(dobInput, dobValidation, "Age must be between 18 and 65.");
        } else {
            showSuccess(dobInput, dobValidation);
        }
    }

    function showError(input, validationMessageElement, message) {
        const formControl = input.parentElement;
        formControl.className = "input-group input-group-sm error";
        validationMessageElement.textContent = message;
    }

    function showSuccess(input, validationMessageElement) {
        const formControl = input.parentElement;
        formControl.className = "input-group input-group-sm success";
        validationMessageElement.textContent = "";
    }

    function calculateAge(dob, currentDate) {
        const dobYear = dob.getFullYear();
        const currentYear = currentDate.getFullYear();
        const age = currentYear - dobYear;

        // Check if the birthday has occurred this year
        const dobMonth = dob.getMonth();
        const currentMonth = currentDate.getMonth();
        if (currentMonth < dobMonth || (currentMonth === dobMonth && currentDate.getDate() < dob.getDate())) {
            return age - 1;
        }
        return age;
    }
});
