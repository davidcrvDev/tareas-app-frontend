import axios from 'axios';

// La URL se carga desde el archivo .env a través de Vite
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const API_URL = `${BASE_URL}/api/tareas`;

// Creación de una instancia de Axios para manejar la API CRUD
const TareaAPI = {
    getAll: () => axios.get(API_URL), // GET /api/tareas
    create: (descripcion) => axios.post(API_URL, { descripcion }), // POST /api/tareas
    update: (id, data) => axios.put(`${API_URL}/${id}`, data), // PUT /api/tareas/:id
    delete: (id) => axios.delete(`${API_URL}/${id}`), // DELETE /api/tareas/:id
};

export default TareaAPI;