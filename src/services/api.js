// API Configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API Error");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (username, password) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  register: (username, password) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  getMe: () => apiCall("/auth/me"),

  logout: () =>
    apiCall("/auth/logout", {
      method: "POST",
    }),
};

// Cars API
export const carsAPI = {
  getAll: () => apiCall("/cars"),
  getById: (id) => apiCall(`/cars/${id}`),
  create: (car) =>
    apiCall("/cars", {
      method: "POST",
      body: JSON.stringify(car),
    }),
  update: (id, car) =>
    apiCall(`/cars/${id}`, {
      method: "PUT",
      body: JSON.stringify(car),
    }),
  remove: (id) =>
    apiCall(`/cars/${id}`, {
      method: "DELETE",
    }),
};

// Rentals API
export const rentalsAPI = {
  create: (carId) =>
    apiCall("/rentals", {
      method: "POST",
      body: JSON.stringify({ carId }),
    }),

  getMyRentals: () => apiCall("/rentals/me"),
};

