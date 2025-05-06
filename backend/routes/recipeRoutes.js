const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipe,
  getRecipesByCategory,
  createRecipe,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipeController');
const { protect, restrictTo } = require('../controllers/authController');

// Log toutes les requêtes pour le débogage
router.use((req, res, next) => {
  console.log('Route appelée:', req.method, req.path);
  next();
});

// Appliquer la protection d'authentification à toutes les routes
router.use(protect);
router.use(restrictTo('caterer'));

// Ordre critique : route spécifique AVANT route générique
// Route pour obtenir les recettes par catégorie - DOIT ÊTRE AVANT /:id
router.get('/category/:category', (req, res, next) => {
  console.log('Route /category/:category appelée avec catégorie:', req.params.category);
  next();
}, getRecipesByCategory);

// Routes pour toutes les recettes
router.get('/', getRecipes);
router.post('/', createRecipe);

// Routes pour une recette spécifique par ID
router.get('/:id', getRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

module.exports = router;