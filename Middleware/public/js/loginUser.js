import { googleLogin, loginUser, register, sendOtpSms, verifyOtp } from "./Services/user.service.js";
//Login
$(document).ready(function () {
  $("#loginForm").submit(function (event) {
    event.preventDefault(); // prevent the browser's default action on form submit
    var email = $("#userNameInput").val();
    var password = $("#passwordInput").val();
    var data = {
      email: email,
      password: password,
    };
    if (data) {
      loginUser(data)
        .then((response) => {
          console.log(response);
          sessionStorage.setItem("loggedUser", response.token);
          sessionStorage.setItem("name", response.user.name);
          sessionStorage.setItem("imageUrl", response.user.imageUrl);
          sessionStorage.setItem("dob", response.user.dob);
          sessionStorage.setItem("gender", response.user.gender);
          sessionStorage.setItem("phone", response.user.phone);
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error("Error during login:", error);
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "Invalid email or password.",
            showCancelButton: false,
            confirmButtonText: "OK",
            iconHtml: '<span class="custom-x-icon"></span>',
            customClass: {
              popup: "custom-swal-popup",
              title: "custom-swal-title",
              confirmButton: "custom-swal-button",
              icon: "custom-swal-icon", // Custom CSS class for the "X" icon
            },
            target: "body",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
        });
    }
  });
});
//Register
$(document).ready(function () {
  $("#userRegister").click(async function (e) {
    e.preventDefault();
    const userName = $("#username").val();
    const email = $("#email").val();
    const password = $("#password").val();
    const phone = $("#phone").val();
    const dob = $("#dob").val();
    const gender = $("input[name='gender']:checked").val() === "true";
    const isPhoneVerified = sessionStorage.getItem("phoneVerified") === "true";
    const passwordConfirm = $("#password-confirm").val();
    const registerUser = {
      name: userName,
      email: email,
      phone: phone,
      dob: dob,
      password: password,
      gender: gender,
    };


    if (!userName || !email || !password || !phone || !dob || !passwordConfirm || gender === undefined) {
      Swal.fire({
        icon: 'warning',
        title: 'Register failed',
        text: 'Please fill in all fields.'
      });
      return result.isConfirmed = false;
    }
    if (username.value.length < 8 || username.value.length > 20) {
      Swal.fire({
        icon: 'warning',
        title: 'Register failed',
        text: 'Fill your name again.'
      });
      return result.isConfirmed = false;
    }

    if (passwordConfirm.value != password.value) {
      Swal.fire({
        icon: 'warning',
        title: 'Register failed',
        text: "Password doesn't match."
      });
      return result.isConfirmed = false;
    }
  
    
    if (!isPhoneVerified) {
      Swal.fire({
        icon: 'warning',
        title: 'Phone Verification Required',
        text: 'You must verify your phone number before registering.'
      });
      return result.isConfirmed = false;
    }
    register(registerUser)
      .then(() => {
        Swal.fire({
          title: "Register Success",
          text: "Congratulations, you have successfully register your account",
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#50b846",
          confirmButtonText: "OK",
          target: "body",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "login.html";
            sessionStorage.setItem("phoneVerified", "false");
          }
        });
      }).catch((err) => {
      });
    
  });

})
//Validate OTP number
$(document).ready(function () {
  function formatVietnamesePhoneNumber(number) {
    if (number.startsWith('0')) {
      return '+84' + number.substring(1);
    }
    return number;
  }

  // Send OTP Click Event
  $('#sendOtp').click(async function (e) {
    e.preventDefault();
    $(this).prop('disabled', true).text('Wait 30s');
    let countdownTime = 30;

    let countdownTimer = setInterval(() => {
      if (countdownTime <= 0) {
        clearInterval(countdownTimer);
        $(this).prop('disabled', false).text('Send OTP');
      } else {
        $(this).text('Wait ' + countdownTime + 's');
        countdownTime--;
      }
    }, 1000);

    let phone = $('#phone').val();
    phone = formatVietnamesePhoneNumber(phone);

    if (phone) {
      try {
        await sendOtpSms(phone);
        Swal.fire('OTP sent successfully.');
        $('#otp-container').show();
      } catch (error) {
        Swal.fire('Error sending OTP: ' + error.responseText);
        clearInterval(countdownTimer);
        $(this).prop('disabled', false).text('Send OTP');
      }
    } else {
      Swal.fire('Please enter a phone number.');
      clearInterval(countdownTimer);
      $(this).prop('disabled', false).text('Send OTP');
    }
  });

  // Verify OTP Click Event
  $('#verifyOtp').click(async function (e) {
    e.preventDefault();
    let phoneNumber = $('#phone').val();
    phoneNumber = formatVietnamesePhoneNumber(phoneNumber);
    const otp = $('#otp1').val() + $('#otp2').val() + $('#otp3').val() + $('#otp4').val() + $('#otp5').val() + $('#otp6').val();

    try {
      await verifyOtp(phoneNumber, otp);
      Swal.fire('OTP verified successfully.');
      sessionStorage.setItem("phoneVerified", "true");
      // Additional logic upon successful verification
    } catch (error) {
      alert('Error verifying OTP: ' + error.responseText);
      Swal.fire('Wrong Otp. Please try again!!!');
    }
  });
});

//Login With google
function handleCallbackRes(res) {
  const profile = res.credential;
  const userData = {
    idToken: profile,
  };
  googleLogin(userData)
    .then((response) => {
      console.log(response);
      sessionStorage.setItem("loggedUser", response.token);
      sessionStorage.setItem("name", response.user.name);
      sessionStorage.setItem("imageUrl", response.user.imageUrl);
      sessionStorage.setItem("dob", response.user.dob);
      sessionStorage.setItem("gender", response.user.gender);
      sessionStorage.setItem("phone", response.user.phone);
      if (sessionStorage.getItem("phone") == "") {
        window.location.href = "verifyProfile.html";
      } else {
        window.location.href = "index.html";
      }
    })
    .catch((ex) => {
      console.log(ex);
    });
}

function initializeGoogleSignIn() {
  if (window.google && window.google.accounts && window.google.accounts.id) {
    window.google.accounts.id.initialize({
      client_id:
        "1065578323385-6ukalkhhqs2il0drjb46dbknj3tfos1q.apps.googleusercontent.com",
      callback: handleCallbackRes,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );
  } else {
    setTimeout(initializeGoogleSignIn, 100);
  }
}
document.addEventListener("DOMContentLoaded", (event) => {
  initializeGoogleSignIn();
});