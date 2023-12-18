import { apiUrl } from "./_endpoint.service.js";
import { getToken } from "./util.service.js";

const endpoint = `${apiUrl}/TrainingProgram`;

const getTrainingProgram = async () => {
  const response = await $.ajax({
    url: `${endpoint}/Get-All`,
    type: "GET",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    }
  });
  return response;
};

const getTrainingProgramById = async (id) => {
  const response = await $.ajax({
    url: `${endpoint}/Get?id=${id}`,
    type: "GET",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    }
  });
  return response;
};
const addTrainingProgram = async (model) => {
  const response = await $.ajax({
    url: `${endpoint}/Add`,
    type: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
    data: model ? JSON.stringify(model) : null
  });
}

export { getTrainingProgram, getTrainingProgramById,addTrainingProgram };
