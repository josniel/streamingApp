// const baseUrl = "http://localhost:3333/api/"
import axios from "axios";
// const apiUrl = process.env.apiUrl
const api = axios.create({
    baseURL: 'http://127.0.0.1:3333/api/'// url base cargada de archivo .env
})


export default api