import api from "./api";

export const getLicences = () => api.get("/licences");
export const getLicenceById = (id) => api.get(`/licences/${id}`);
export const createLicence = (licence) => api.post("/licences", licence);
export const updateLicence = (id, licence) => api.put(`/licences/${id}`, licence);
export const deleteLicence = (id) => api.delete(`/licences/${id}`);