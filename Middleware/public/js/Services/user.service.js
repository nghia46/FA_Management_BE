import { apiUrl } from "./_endpoint.service.js";
import { getToken } from "./util.service.js";
const endpoint = `${apiUrl}/User`;

const loginUser = async (model) => {
  const response = await $.ajax({
    url: `${endpoint}/Login`,
    type: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: model ? JSON.stringify(model) : undefined,
  });

  return response;
};
const register = async (model) => {
  const response = await $.ajax({
    url: `${endpoint}/Register`,
    type: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: model ? JSON.stringify(model) : undefined,
  });

  return response;
};
const googleLogin = async (model) => {
  const response = await $.ajax({
    url: `${endpoint}/Google-Login`,
    type: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: model ? JSON.stringify(model) : undefined,
  });
  return response;
};
const updateUser = async (userID, model) => {
  let queryString = `id=${userID}`;
  const response = await $.ajax({
    url: `${endpoint}/Update?${queryString}`,
    type: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: model ? JSON.stringify(model) : undefined,
  });

  return response;
};
const getUpdatedUser = async (userID) => {
  let queryString = `id=${userID}`;
  const response = await $.ajax({
    url: `${endpoint}/Updated-User?${queryString}`,
    type: "GET",
  });
  return response;
}


const sendOtpSms = (phone) => {
  return $.ajax({
    url: `${endpoint}/Send-Otp-Sms?phoneNumber=${encodeURIComponent(phone)}`,
    type: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });
};

const verifyOtp = (phoneNumber, otp) => {
  return $.ajax({
    url: `${endpoint}/Verify-Otp?phoneNumber=${encodeURIComponent(phoneNumber)}&otp=${encodeURIComponent(otp)}`,
    type: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

};
// Function to change user password
const updatePassword = async (passwordData) => {
  const response = await $.ajax({
    url: `${endpoint}/Update-Password`,
    type: "PUT", // Use PUT method for changing the password
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`, // Add authorization header if needed
    },
    data: passwordData ? JSON.stringify(passwordData) : undefined,
  });
  return response;
};
export { loginUser, register, googleLogin, updateUser, getUpdatedUser, sendOtpSms, verifyOtp,updatePassword }