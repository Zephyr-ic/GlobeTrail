import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add request interceptor to handle token expiration
axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = sessionStorage.getItem('accessToken'); // Change to sessionStorage
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor to handle refresh automatically
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent multiple retries
            try {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    sessionStorage.setItem('accessToken', newAccessToken); // Change to sessionStorage
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest); // Retry the original request
                } else {
                    window.location.href = '/login'; // Redirect to login if refresh fails
                }
            } catch (refreshError) {
                console.error('Token refresh error:', refreshError);
                window.location.href = '/login'; // Redirect to login if refresh fails
            }
        }

        return Promise.reject(error);
    }
);

const refreshAccessToken = async () => {
    try {
        const { data } = await axios.post('/refresh-token', {
            refreshToken: localStorage.getItem('refreshToken'),
        });
        return data.accessToken;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};

export default axiosInstance;
