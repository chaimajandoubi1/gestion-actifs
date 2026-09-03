import api from "./api";

export const getMaintenances = () => api.get("/maintenances");
export const getMaintenanceById = (id) => api.get(`/maintenances/${id}`);
export const createMaintenance = (maintenance) => api.post("/maintenances", maintenance);
export const updateMaintenance = (id, maintenance) => api.put(`/maintenances/${id}`, maintenance);
export const deleteMaintenance = (id) => api.delete(`/maintenances/${id}`);