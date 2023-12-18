import { apiUrl } from "./_endpoint.service.js";
import { getToken } from "./util.service.js";
const endpoint = `${apiUrl}/UserRole`;

const getAllUserRole = async () => {
  const response = await $.ajax({
    url: `${endpoint}/Get-All`,
    type: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response;
};

export { getAllUserRole };
