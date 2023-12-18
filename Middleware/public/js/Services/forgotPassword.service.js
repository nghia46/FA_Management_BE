import { getToken } from "./util.service.js";
import { apiUrl } from "./_endpoint.service.js";

const sendEmail = async (email) => {
  const startTime = performance.now();
  const response = await fetch(
    `${apiUrl}/ForgotPassword/Send-Code`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: email ? JSON.stringify(email) : undefined,
    }
  );
  const endTime = performance.now();
  const durationMilliseconds = endTime - startTime;
  const durationSeconds = durationMilliseconds / 1000;
  const duration = Math.round(durationSeconds);
  if (!response.ok) {
    return response.text().then((text) => {
      throw new Error(text);
    });
  } else {
    return { data: await response.json(), duration };
  }
};

const verifyCode = async (code, email) => {
  const queryParams = new URLSearchParams({
    code: code,
    email: email,
  });
  const response = await fetch(
    `${apiUrl}/ForgotPassword/Verify-Code?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    return response.text().then((text) => {
      throw new Error(text);
    });
  } else {
    return response.text();
  }
};

const resetPassword = async (email, password) => {
  const queryParams = new URLSearchParams({
    email: email,
    password: password,
  });
  const response = await fetch(
    `${apiUrl}/ForgotPassword/Reset-Password?${queryParams}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  if (!response.ok) {
    return response.text().then((text) => {
      throw new Error(text);
    });
  } else {
    return response.text();
  }
};

export { sendEmail, verifyCode, resetPassword };
