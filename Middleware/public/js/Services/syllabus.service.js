import { apiUrl } from "./_endpoint.service.js";
import { getToken, jsonToQueryString } from "./util.service.js";
const endpoint = `${apiUrl}/Syllabus`;

const getAllSyllabus = async (model) => {
  let queryString = jsonToQueryString(model);
  const response = await $.ajax({
    url: `${endpoint}/Get-All?${queryString}`,
    type: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response;
};

const createSyllabus = async (model) => {
  const response = await $.ajax({
    url: `${endpoint}/Add`,
    type: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    data: model ? JSON.stringify(model) : undefined,
  });
  return response;
};
const createSyllabusByCsv = async (model) => {
  const response = await $.ajax({
    url: `${endpoint}/Add-By-CSV`,
    type: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    processData: false,
    contentType: false,
    data: model,
  });
  return response;
};

const deleteSyllabus = async (id) => {
  const response = await $.ajax({
    url: `${endpoint}/Delete?id=${id}`,
    type: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
  });
  return response;
};

const getSyllabus = async (id) => {
  const response = await $.ajax({
    url: `${endpoint}/Get?id=${id}`,
    type: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
  });
  return response;
};

const updateSyllabus = async (id,model) => {
  const response = await $.ajax({
    url: `${endpoint}/Update?id=${id}`,
    type: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data: model ? JSON.stringify(model) : null,
    contentType: "application/json"
  });
  return response;
};
export {
  getAllSyllabus,
  createSyllabus,
  createSyllabusByCsv,
  deleteSyllabus,
  getSyllabus,
  updateSyllabus, 
};
