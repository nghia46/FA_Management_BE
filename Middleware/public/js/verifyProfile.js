import { updateUser, getUpdatedUser } from "./Services/user.service.js";
import { sendOtpSms, verifyOtp } from "./Services/user.service.js";
import { parseJwt } from "./Services/util.service.js";

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

document.addEventListener('DOMContentLoaded', function () {
    // Get references to form fields and warning elements
    const phoneInput = document.getElementById('phone');
    const dobInput = document.getElementById('dob');
    const maleRadio = document.getElementById('male');
    const femaleRadio = document.getElementById('female');
    const submitButton = document.getElementById('submit');

    // Set initial values from sessionStorage
    phoneInput.value = sessionStorage.getItem("phone");
    dobInput.value = sessionStorage.getItem("dob");
    
    femaleRadio.checked = !maleRadio.checked;

    // Event listener for the submit button
    submitButton.addEventListener('click', async function (event) {
        event.preventDefault();
        // Check if phone number is verified
        const memberId = parseJwt(sessionStorage.getItem("loggedUser")).Id;
        const userName = sessionStorage.getItem("name");
        const phone = phoneInput.value;
        const dob = dobInput.value;
        const gender = maleRadio.checked ? true : false;
        const imageFile = sessionStorage.getItem("imageUrl");
        const isPhoneVerified = sessionStorage.getItem("phoneVerified") === "true";

        const userProfile = {
            name: userName,
            phone: phone,
            dob: dob,
            gender: gender,
            imageUrl: imageFile
        };

        if (!isPhoneVerified) {
            Swal.fire({
              icon: 'warning',
              title: 'Phone Verification Required',
              text: 'You must verify your phone number before registering.'
            });
            return result.isConfirmed = false;
          } 
        
        try {
            const updatedProfile = await updateUserAndSessionStorage(memberId, userProfile);
            sessionStorage.setItem("phoneVerified", "false");
            console.log('User Profile:', JSON.stringify(updatedProfile));
        } catch (error) {

            console.error('Error updating user and session storage:', error);
        }

    });

    async function updateUserAndSessionStorage(userId, userProfile) {
        try {

            await updateUser(userId, userProfile)
                .then(() => {
                    Swal.fire({
                        title: "Update Success",
                        text: "Congratulations, you have successfully update your profile",
                        icon: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#50b846",
                        confirmButtonText: "OK",
                        target: "body",

                    }).then((result) => {

                        if (result.isConfirmed) {
                             window.location.href = "index.html";
                             
                        }
                    });
                }).catch((err) => {
                    let errArr = Object.values(err.responseJSON.errors);
                    let errMsg = errArr.join("<br>");
                    console.log(errMsg);

                    Swal.fire({
                        title: "Fail to update profile",
                        html: "Fill all required fields!!!",
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#F27474",
                        confirmButtonText: "OK",
                        target: "body",
                    }).then((result) => {
                        if (result.isConfirmed) {
                        }
                    });
             
                });

            const updatedProfile = await getUpdatedUser(userId);
            updateSessionStorage(updatedProfile);
            return updatedProfile;
        } catch (error) {
            console.error('Error updating user or fetching updated user profile:', error);
            throw error;
        }
      
    }

    function updateSessionStorage(updatedProfile) {
        console.log('Updated Profile:', updatedProfile);
        sessionStorage.setItem("name", updatedProfile.name);
        sessionStorage.setItem("phone", updatedProfile.phone);
        sessionStorage.setItem("dob", updatedProfile.dob);
        sessionStorage.setItem("gender", updatedProfile.gender);
        if (updatedProfile.imageUrl) {
            sessionStorage.setItem("imageUrl", updatedProfile.imageUrl);
        } else {
            console.error('Image URL is undefined in the updated profile.');
        }
    }
})



