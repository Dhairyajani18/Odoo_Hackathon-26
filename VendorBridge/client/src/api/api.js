import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Vendor APIs
export const vendorAPI = {
  getAll: () => axios.get(`${API_URL}/vendors`),
  create: (data) => axios.post(`${API_URL}/vendors`, data),
  update: (id, data) => axios.put(`${API_URL}/vendors/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/vendors/${id}`),
  getById: (id) => axios.get(`${API_URL}/vendors/${id}`),
};

// RFQ APIs
export const rfqAPI = {
  getAll: () => axios.get(`${API_URL}/rfqs`),
  create: (data) => axios.post(`${API_URL}/rfqs`, data),
  update: (id, data) => axios.put(`${API_URL}/rfqs/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/rfqs/${id}`),
  getById: (id) => axios.get(`${API_URL}/rfqs/${id}`),
};

// Quotation APIs
export const quotationAPI = {
  getAll: () => axios.get(`${API_URL}/quotations`),
  create: (data) => axios.post(`${API_URL}/quotations`, data),
  update: (id, data) => axios.put(`${API_URL}/quotations/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/quotations/${id}`),
  getById: (id) => axios.get(`${API_URL}/quotations/${id}`),
};

// Purchase Order APIs
export const poAPI = {
  getAll: () => axios.get(`${API_URL}/pos`),
  create: (data) => axios.post(`${API_URL}/pos`, data),
  update: (id, data) => axios.put(`${API_URL}/pos/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/pos/${id}`),
  getById: (id) => axios.get(`${API_URL}/pos/${id}`),
};

// Invoice APIs
export const invoiceAPI = {
  getAll: () => axios.get(`${API_URL}/invoices`),
  create: (data) => axios.post(`${API_URL}/invoices`, data),
  update: (id, data) => axios.put(`${API_URL}/invoices/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/invoices/${id}`),
  getById: (id) => axios.get(`${API_URL}/invoices/${id}`),
};
