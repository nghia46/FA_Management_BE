import { apiUrl } from './_endpoint.service.js';
import { getToken } from './util.service.js';
const endpoint = `${apiUrl}/Permission`

const getAllPermissions = async ()=> {
    const response = await $.ajax({
        type: "GET",
        url: `${endpoint}/Get-All`,
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return response;
}
const updatePermission = async (model)=> {
    const response = await $.ajax({
        type: "PUT",
        url: `${endpoint}/Update`,
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
        data: model ? JSON.stringify(model) : null
    });
    return response;
}
export {
    getAllPermissions,
    updatePermission
}
