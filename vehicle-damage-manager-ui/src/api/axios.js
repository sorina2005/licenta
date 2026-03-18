import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api', // Adresa backend-ului din Docker
});

export default instance;