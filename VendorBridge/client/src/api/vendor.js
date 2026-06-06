import { vendorAPI } from "./api";

// Re-export for backward compatibility
export const getVendors = () => vendorAPI.getAll();
export const addVendor = (data) => vendorAPI.create(data);
export const updateVendor = (id, data) => vendorAPI.update(id, data);
export const deleteVendor = (id) => vendorAPI.delete(id);