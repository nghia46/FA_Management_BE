import { apiUrl } from "./_endpoint.service.js";
import { getToken } from "./util.service.js";
const endpoint = `${apiUrl}/Location`;

const getAllLocation = async () => {
  const response = await $.ajax({
    url: `${endpoint}/Get-All`,
    type: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response;
};

const createClass = async (model) => {
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

const deleteClass = async (id) => {
  const response = await $.ajax({
    url: `${endpoint}/Delete?id=${id}`,
    type: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response;
};

const getLocation = async (id) => {
  const response = await $.ajax({
    url: `${endpoint}/Get?id=${id}`,
    type: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response;
};

export { getAllLocation, createClass, deleteClass, getLocation};
