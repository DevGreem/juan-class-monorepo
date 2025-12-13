import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'development' ?
    'http://localhost:8000/api' : '';

export default class PHPApi {

    static async get(endpoint: string, params = {}) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/${endpoint}`,
                {
                    params: params
                }
            );

            return response.data;
        }
        catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
    
    static async post(endpoint: string, params = {}, data = {}) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/${endpoint}`,
                data,
                {
                    params: params
                }
            );

            return response.data;
        }
        catch (error) {
            console.error('Error posting data:', error);
            throw error;
        }
    }

    static async patch(endpoint: string, params = {}, data = {}) {
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/${endpoint}`,
                data,
                {
                    params: params
                }
            );

            return response.data;
        }
        catch (error) {
            console.error('Error patching data:', error);
            throw error;
        }
    }

    static async delete(endpoint: string, params = {}) {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/${endpoint}`,
                {
                    params: params
                }
            );

            return response.data;
        }
        catch (error) {
            console.error('Error deleting data:', error);
            throw error;
        }
    }
}