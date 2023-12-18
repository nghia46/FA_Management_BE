import { updateUser, getUpdatedUser, sendOtpSms, verifyOtp } from "./Services/user.service.js";
import { parseJwt } from "./Services/util.service.js";

document.addEventListener('DOMContentLoaded', function () {
    // Get references to form fields and warning elements
    const userNameInput = document.getElementById('userNameInput');
    const phoneInput = document.getElementById('phone');
    const dobInput = document.getElementById('dob');
    const maleRadio = document.getElementById('male');
    const femaleRadio = document.getElementById('female');
    const imageInput = document.getElementById('formFile');
    const submitButton = document.getElementById('submit');

    // Set initial values from sessionStorage
    userNameInput.value = sessionStorage.getItem("name");
    phoneInput.value = sessionStorage.getItem("phone");
    dobInput.value = sessionStorage.getItem("dob");
    maleRadio.checked = sessionStorage.getItem("gender") === "true";
    femaleRadio.checked = !maleRadio.checked;

    // Event listener for the submit button
    submitButton.addEventListener('click', async function (event) {
        event.preventDefault();
        const memberId = parseJwt(sessionStorage.getItem("loggedUser")).Id;
        const userName = userNameInput.value;
        const phone = phoneInput.value;
        const dob = dobInput.value;
        const gender = maleRadio.checked ? true : false;
        const imageFile = imageInput.files[0];
        const isPhoneVerified = sessionStorage.getItem("phoneVerified") === "true";

        if (imageFile) {
            const compressedImage = await compressImage(imageFile);
            const base64Image = await readImageFile(compressedImage);

            const userProfile = {
                name: userName,
                phone: phone,
                dob: dob,
                gender: gender,
                imageUrl: base64Image
            };
            
        } else {
            const userProfile = {
                name: userName,
                phone: phone,
                dob: dob,
                gender: gender,
                imageUrl: sessionStorage.getItem("imageUrl")
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
        }
    });
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
                    window.location.reload();
                }
              });
        }).catch((err) => {
            let errArr = Object.values(err.responseJSON.errors);
            let errMsg = errArr.join("<br>");
            console.log(errMsg);
            Swal.fire({
                title: "Fail to update profile",
                html: errMsg,
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

function readImageFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function () {
            resolve(reader.result);
        };

        reader.onerror = function (error) {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}

async function compressImage(file) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function () {
            const maxWidth = 120;
            const maxHeight = 120;

            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);

                width *= ratio;
                height *= ratio;
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                resolve(new File([blob], file.name, { type: file.type }));
            }, file.type);
        };

        img.onerror = function (error) {
            reject(error);
        };

        img.src = URL.createObjectURL(file);
    });
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