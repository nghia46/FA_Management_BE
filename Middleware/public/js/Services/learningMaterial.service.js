import { apiUrl } from "./_endpoint.service.js";
import { getToken } from "./util.service.js";

const endpoint = `${apiUrl}/LearningMaterial`;

const getAllMaterials = async () => {
  const response = await $.ajax({
    url: `${endpoint}/Get-All`,
    type: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response;
};
const downloadMaterial = async (model) => {
    const response = await $.ajax({
        url: `${endpoint}/Download`,
        type: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json"
        },
        data: model ? JSON.stringify(model) : null,
        xhrFields: {
            responseType: 'blob'
        }
    });
    return response;
};
const uploadMaterial = async (model) => {
    const response = await $.ajax({
        url: `${endpoint}/Add`,
        type: "PUT",
        headers: {
            Authorization: `Bearer ${getToken()}`
        },
        data: model,
        contentType: false,
        processData: false
    });
    return response;
};
export {
    getAllMaterials,
    downloadMaterial,
    uploadMaterial
}