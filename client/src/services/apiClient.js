import axios from 'axios';
import { API_BASE_URL } from '../utils/constants.js';

/**
 * Axios instance configured for app API requests
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
