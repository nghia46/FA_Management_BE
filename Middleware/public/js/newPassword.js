import { resetPassword } from "./Services/forgotPassword.service.js";

const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", () => {
  const email = localStorage.getItem("emailForgot");
  const password = document.getElementById("inputPassword").value;
  const confirmPassword = document.getElementById("inputConfirmPassword").value;

  if (password !== confirmPassword) {
    Swal.fire({
      title: "Error!",
      text: "Confirm Password did not match. Please try again!",
      icon: "error",
      confirmButtonText: "OK",
      target: "body",
    });
  } else {
    showLoadingBackdrop();
    resetPassword(email, password)
      .then((res) => {
        hideLoadingBackdrop();
        localStorage.removeItem("emailForgot");
        sessionStorage.removeItem("loggedUser");
        Swal.fire({
          title: "Change Password Success",
          text: "Congratulations, you have successfully changed your password",
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#50b846",
          confirmButtonText: "OK",
          target: "body",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "login.html";
          }
        });
      })
      .catch((err) => {
        hideLoadingBackdrop();
        Swal.fire({
          title: "Error!",
          text: err.message,
          icon: "error",
          confirmButtonText: "OK",
          target: "body",
        });
      });
  }
});

function showLoadingBackdrop() {
  $("#loadingBackdrop").addClass("loading-active");
}
function hideLoadingBackdrop() {
  $("#loadingBackdrop").removeClass("loading-active");
}
