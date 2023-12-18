import { apiUrl } from "./_endpoint.service.js";
import { getToken, jsonToQueryString } from "./util.service.js";

const endpoint = `${apiUrl}/UserManagement`;

const getAllUser = async (model) => {
  let queryString = jsonToQueryString(model);
  const response = await $.ajax({
    url: `${endpoint}/Get-All?${queryString}`,
    type: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response;
};

const addUser = async (model) => {
  const response = await $.ajax({
    url: `${endpoint}/Add`,
    type: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    data: model ? JSON.stringify(model) : undefined,
  });
  return response;
};
const deleteUser = async (userID) => {
  let queryString = `id=${userID}`;
  const response = await $.ajax({
    url: `${endpoint}/Delete?${queryString}`,
    type: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response;
};

const toggleUserStatus = async (userID) => {
  let queryString = `id=${userID}`;
  const response = await $.ajax({
    url: `${endpoint}/Toggle-Status?${queryString}`,
    type: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response;
};

const changeUserRole = async (userID, userRole) => {
  let queryString = `id=${userID}`;
  const response = await $.ajax({
    url: `${endpoint}/Update-Role?${queryString}`,
    type: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    data: `"${userRole}"`,
  });

  return response;
};

const getUser = async (userID) => {
  let queryString = `id=${userID}`;
  const response = await $.ajax({
    url: `${endpoint}/Get?${queryString}`,
    type: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
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
      Authorization: `Bearer ${getToken()}`,
    },
    data: model ? JSON.stringify(model) : undefined,
  });

  return response;
};

export {
  getAllUser,
  addUser,
  deleteUser,
  toggleUserStatus,
  changeUserRole,
  getUser,
  updateUser
};
