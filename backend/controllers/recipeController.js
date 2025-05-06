// Modèle de recette 
const Recipe = require('../models/Recipe');

// Récupérer toutes les recettes pour le traiteur connecté
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id });
    res.status(200).json({ success: true, data: recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des recettes', 
      error: error.message 
    });
  }
};

// Récupérer les recettes par catégorie
exports.getRecipesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log('Catégorie demandée:', category);
    console.log('Utilisateur authentifié:', req.user);
    
    if (!category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Catégorie non spécifiée' 
      });
    }
    
    // Utiliser une recherche insensible à la casse pour la catégorie
    const recipes = await Recipe.find({
      createdBy: req.user.id,
      category: new RegExp(`^${category}$`, 'i') // recherche insensible à la casse
    });
    
    console.log('Recettes trouvées:', recipes.length);
    res.status(200).json({ success: true, data: recipes });
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des recettes par catégorie', 
      error: error.message 
    });
  }
};

// Récupérer une recette spécifique
exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });
    
    if (!recipe) {
      return res.status(404).json({ 
        success: false, 
        message: 'Recette non trouvée' 
      });
    }
    
    res.status(200).json({ success: true, data: recipe });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération de la recette', 
      error: error.message 
    });
  }
};

// Créer une nouvelle recette
exports.createRecipe = async (req, res) => {
  try {
    const { name, description, ingredients, image, category } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Les champs nom et description sont obligatoires'
      });
    }
    
    const recipe = await Recipe.create({
      name,
      description,
      ingredients: ingredients || [],
      image,
      category: category || 'Uncategorized',
      createdBy: req.user.id
    });
    
    res.status(201).json({ success: true, data: recipe });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la création de la recette', 
      error: error.message 
    });
  }
};

// Mettre à jour une recette
exports.updateRecipe = async (req, res) => {
  try {
    const { name, description, ingredients, image, category } = req.body;
    
    // Vérifier si les champs obligatoires sont présents
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Les champs nom et description sont obligatoires'
      });
    }
    
    // Rechercher et mettre à jour la recette
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { 
        name, 
        description, 
        ingredients: ingredients || [], 
        image, 
        category: category || 'Uncategorized' 
      },
      { new: true, runValidators: true }
    );
    
    // Vérifier si la recette existe
    if (!recipe) {
      return res.status(404).json({ 
        success: false, 
        message: 'Recette non trouvée ou vous n\'êtes pas autorisé à la modifier' 
      });
    }
    
    res.status(200).json({ success: true, data: recipe });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la mise à jour de la recette', 
      error: error.message 
    });
  }
};

// Supprimer une recette
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });
    
    if (!recipe) {
      return res.status(404).json({ 
        success: false, 
        message: 'Recette non trouvée ou vous n\'êtes pas autorisé à la supprimer' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Recette supprimée avec succès' 
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la suppression de la recette', 
      error: error.message 
    });
  }
};