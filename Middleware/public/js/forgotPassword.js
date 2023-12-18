import { sendEmail } from "./Services/forgotPassword.service.js";

document.addEventListener("DOMContentLoaded", function () {
  const inputElement = document.getElementById("email");
  const submitBtn = document.getElementById("btn");
  submitBtn.addEventListener("click", function () {
    const email = document.getElementById("email").value;
    showLoadingBackdrop();
    sendEmail(email)
      .then((res) => {
        localStorage.setItem("emailForgot", res.data.email);
        localStorage.setItem("durationAPI", res.duration);
        window.location.href = "verification.html";
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
  });

  inputElement.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      submitBtn.click();
    }
  });
});

function showLoadingBackdrop() {
  $("#loadingBackdrop").addClass("loading-active");
}
function hideLoadingBackdrop() {
  $("#loadingBackdrop").removeClass("loading-active");
}
