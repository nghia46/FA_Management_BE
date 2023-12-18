// changePasswordValidation.js
document.addEventListener("DOMContentLoaded", function () {
    const currentPasswordInput = document.getElementById("currentPasswordInput");
    const newPasswordInput = document.getElementById("newPasswordInput");

    const currentPasswordValidation = document.getElementById("currentPasswordValidation");
    const newPasswordValidation = document.getElementById("newPasswordValidation");

    // Reference to the form and the submit button
    const submitButton = document.getElementById("changePassword-submit");

    // Add a click event listener to the submit button
    submitButton.addEventListener("click", function (event) {
        // Prevent the default form submission
        event.preventDefault();
        
        // Validate the fields when the button is clicked
        validateCurrentPassword();
        validateNewPassword();
    });

    function validateCurrentPassword() {
        if (currentPasswordInput.value.trim() === "") {
            showError(currentPasswordInput, currentPasswordValidation, "Old password is required.");
        } else {
            showSuccess(currentPasswordInput, currentPasswordValidation);
        }
    }

    function validateNewPassword() {
        if (newPasswordInput.value.trim() === "") {
            showError(newPasswordInput, newPasswordValidation, "New password is required.");
        } else {
            showSuccess(newPasswordInput, newPasswordValidation);
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
});
