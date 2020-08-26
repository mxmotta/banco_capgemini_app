import axios from 'axios';

const client = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 1000,
  headers: {'Accept': 'application/json'}
});

export default client; 