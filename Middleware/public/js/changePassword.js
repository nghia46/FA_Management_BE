// changePassword.js
import { updatePassword } from "./Services/user.service.js";
document.addEventListener("DOMContentLoaded", function () {
    const changePasswordForm = document.getElementById("changePasswordForm");
    const changePasswordSubmitButton = document.getElementById("changePassword-submit");

    // Add a submit event listener to the change password form
    changePasswordForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Validate the form before submitting to the server
        if (validateChangePasswordForm()) {
            // If the form is valid, you can log the data before sending it to the server
            logFormData();
            // Then, you can send the data to the server
            // await sendChangePasswordRequest();
        }
    });

    changePasswordSubmitButton.addEventListener("click", function (event) {
        // Prevent the default form submission
        event.preventDefault();
        logFormData();
    });

    function validateChangePasswordForm() {
        return true;
    }

    function logFormData() {
        const currentPassword = document.getElementById("currentPasswordInput").value;
        const newPassword = document.getElementById("newPasswordInput").value;

        const model = {
            currentPassword: currentPassword,
            newPassword: newPassword
        }

        updatePassword(model)
            .then(() => {
                Swal.fire({
                    title: "Change Password Success",
                    html: "Congratulations, you have successfully changed your password<br><p style='color:red'>OK! login again!</p>",
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#50b846",
                    confirmButtonText: "OK",
                    target: "body",
                  }).then((result) => {
                    if (result.isConfirmed) {
                        sessionStorage.removeItem("loggedUser");
                        window.location.href = "login.html"
                    }
                  });
            }).catch((err) => {
                Swal.fire({
                    title: "Fail to change password",
                    text: "The current password is incorrect",
                    icon: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#F27474",
                    confirmButtonText: "OK",
                    target: "body",
                  }).then((result) => {
                    if (result.isConfirmed) {
                        
                    }
                  });
            })
    }
});
