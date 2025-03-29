import axios from 'axios';

export const fetchAuthStatus = async (url) => {
    try {
        const response = await axios.get(url, { withCredentials: true });
        return response.data;
    } catch (error) {
        return { isLoggedIn: false, user: null };
    }
};
