import { sendEmail, verifyCode } from "./Services/forgotPassword.service.js";

document.addEventListener("DOMContentLoaded", function () {
  const durationAPI = localStorage.getItem("durationAPI");
  const email = localStorage.getItem("emailForgot");
  let countdownValue = 60 - durationAPI;
  const sendButton = document.getElementById("sendButton");
  const reSendButton = document.getElementById("reSendButton");
  const subText = document.querySelector(".email-text");
  subText.textContent = email;
  function updateCountdown() {
    const countdownElement = document.querySelector(".count-down");

    countdownElement.textContent = countdownValue;

    countdownValue--;

    if (countdownValue < 0) {
      countdownElement.textContent = 0;
      clearInterval(countdownInterval);
    }
  }

  const countdownInterval = setInterval(updateCountdown, 1000);

  sendButton.addEventListener("click", function () {
    const code1 = document.getElementById("code1").value;
    const code2 = document.getElementById("code2").value;
    const code3 = document.getElementById("code3").value;
    const code4 = document.getElementById("code4").value;
    const code5 = document.getElementById("code5").value;
    const code6 = document.getElementById("code6").value;
    const code = code1 + code2 + code3 + code4 + code5 + code6;
    showLoadingBackdrop();
    verifyCode(code, email)
      .then((res) => {
        console.log(res);
        sessionStorage.setItem("loggedUser", res);
        localStorage.removeItem("durationAPI");
        window.location.href = "newPassword.html";
      })
      .catch((err) => {
        hideLoadingBackdrop();
        if (err.message === "Verify code incorrect") {
          Swal.fire({
            title: "Error!",
            text: err.message,
            icon: "error",
            confirmButtonText: "OK",
            target: "body",
          });
        }

        if (err.message === "Verify code expired") {
          Swal.fire({
            title: "Error!",
            text: err.message,
            icon: "error",
            confirmButtonText: "OK",
            target: "body",
          });
          sendButton.style.display = "none";
          reSendButton.style.display = "block";
        }
      });
  });

  reSendButton.addEventListener("click", function () {
    showLoadingBackdrop();
    sendEmail(email)
      .then((res) => {
        localStorage.setItem("emailForgot", res.data.email);
        localStorage.setItem("durationAPI", res.duration);
        location.reload(true);
      })
      .catch((err) => {
        hideLoadingBackdrop();
        console.log(err);
        Swal.fire({
          title: "Error!",
          text: err.message,
          icon: "error",
          confirmButtonText: "OK",
          target: "body",
        });
      });
  });
});

function showLoadingBackdrop() {
  $("#loadingBackdrop").addClass("loading-active");
}
function hideLoadingBackdrop() {
  $("#loadingBackdrop").removeClass("loading-active");
}
