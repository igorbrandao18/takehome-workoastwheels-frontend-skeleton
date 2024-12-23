import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api'
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('@VehicleRental:token');
            localStorage.removeItem('@VehicleRental:user');
        }
        return Promise.reject(error);
    }
); 