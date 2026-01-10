import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://study-manager-production-826b.up.railway.app',
});

// Add a request interceptor (Optional logging)
client.interceptors.request.use((config) => {
    // We are using ?admin_password=... query param for auth mostly,
    // but if we need headers later, add them here.
    return config;
});

export default client;
