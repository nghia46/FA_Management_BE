import { getToken } from "./util.service.js";
import { apiUrl } from "./_endpoint.service.js";
const endpoint = `${apiUrl}/Class`;

const getAllClass = async () => {
  const response = await $.ajax({
    type: "GET",
    url: `${endpoint}/Get-All`,
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    }
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

const getClass = async (id) => {
  const response = await $.ajax({
    url: `${endpoint}/Get?id=${id}`,
    type: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response;
};

export { getAllClass, createClass, deleteClass, getClass };
