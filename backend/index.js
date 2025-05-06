const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const cors = require('cors');
const app = express();

// Configuration CORS simple
app.use(cors({
  origin: '*',  // Accepte toutes les origines pour les tests
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Middleware de base
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
// Dans index.js ou app.js
app.use('/api/recipes', recipeRoutes);  // C'est important que ce soit /api/recipes et non /api/recipe

// Connexion MongoDB
mongoose.connect('mongodb+srv://alleleya93:2aB2Hz0IBwAF1foo@cluster0.03spdaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('MongoDB connecté');
    app.listen(3000, () => console.log('Serveur sur port 3000'));
  })
  .catch(err => console.error('Erreur DB:', err));