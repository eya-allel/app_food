import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Configuration de base
const api = axios.create({
  baseURL: API_URL
});

// Ajout du token (si nécessaire)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fonctions simples
export const fetchRecipes = () => api.get('/recipes');
export const fetchRecipe = (id) => api.get(`/recipes/${id}`);
export const createRecipe = (data) => api.post('/recipes', data);
export const updateRecipe = (id, data) => api.put(`/recipes/${id}`, data);
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);

// Fonction corrigée pour récupérer les recettes par catégorie
export const fetchRecipesByCategory = (category) => {
  // Log pour déboguer l'URL
  console.log(`Requête API pour catégorie: /recipes/category/${encodeURIComponent(category)}`);
  return api.get(`/recipes/category/${encodeURIComponent(category)}`);
};

export default api;