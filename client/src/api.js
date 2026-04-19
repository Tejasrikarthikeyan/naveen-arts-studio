import axios from 'axios';

// This will use your hosted backend URL when deployed, and localhost when developing
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const submitCommission = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const adminLogin = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getOrders = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/orders`, {
      headers: { Authorization: token }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateOrderStatus = async (id, status, token) => {
  try {
    const response = await axios.put(`${API_URL}/orders/${id}/status`, { status }, {
      headers: { Authorization: token }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateAdminCredentials = async (credentials, token) => {
  try {
    const response = await axios.put(`${API_URL}/users/update`, credentials, {
      headers: { Authorization: token }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteOrder = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/orders/${id}`, {
      headers: { Authorization: token }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
