import axios from 'axios';

const apiRequest = async (url, method, data = null) => {
    let access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    try {
        const config = {
            method: method,
            url: url,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data
        };

        if (!access_token) {
            throw new Error('No access token available');
        }

        const res = await axios.post(
            'http://127.0.0.1:8000/api/token/refresh/',
            { refresh: refresh_token }
        );
        access_token = res.data.access;
        localStorage.setItem('access_token', access_token);

        config.headers['Authorization'] = `Bearer ${access_token}`;

        const response = await axios(config);
        return response;
    } catch (error) {
        throw error;
    }
};

export default apiRequest;