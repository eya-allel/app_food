import React, { useState, useEffect } from 'react';
import { FiPlus, FiFilter } from 'react-icons/fi';
import RecipeCard from '../components/RecipeCard';
import RecipeForm from '../components/RecipeForm';
import { fetchRecipes, fetchRecipesByCategory, deleteRecipe, createRecipe, updateRecipe } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const { currentUser } = useAuth();

  // Catégories de recettes disponibles
  const categories = [
    'All',
    'Uncategorized',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Appetizers',
    'Soups',
    'Salads',
    'Main Dishes',
    'Side Dishes',
    'Desserts',
    'Snacks',
    'Drinks'
  ];

  useEffect(() => {
    // Ne récupérer les recettes que si l'utilisateur est un traiteur
    if (currentUser && currentUser.role === 'caterer') {
      if (categoryFilter === 'All') {
        loadRecipes();
      } else {
        loadRecipesByCategory(categoryFilter);
      }
    } else {
      setIsLoading(false);
    }
  }, [currentUser, categoryFilter]);

  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      console.log('Récupération de toutes les recettes pour l\'utilisateur:', currentUser?.id);
      const response = await fetchRecipes();
      console.log('Réponse API pour toutes les recettes:', response);
      
      // Définir les recettes directement à partir des données de réponse
      if (response && response.data && response.data.data) {
        setRecipes(response.data.data);
      } else if (response && response.data) {
        setRecipes(response.data);
      } else {
        setRecipes([]);
      }
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des détails des recettes:', err);
      setError('Échec du chargement des recettes. Veuillez réessayer.');
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction améliorée pour charger les recettes par catégorie
  const loadRecipesByCategory = async (category) => {
    try {
      setIsLoading(true);
      console.log(`Récupération des recettes pour la catégorie: ${category}`);
      
      // Vérifier l'URL avant la requête
      console.log(`URL de catégorie: /recipes/category/${encodeURIComponent(category)}`);
      
      const response = await fetchRecipesByCategory(category);
      console.log('Réponse API pour les recettes de catégorie:', response);
      
      // Définir les recettes directement à partir des données de réponse
      if (response && response.data && response.data.data) {
        setRecipes(response.data.data);
      } else if (response && response.data) {
        setRecipes(response.data);
      } else {
        setRecipes([]);
      }
      setError(null);
    } catch (err) {
      console.error(`Erreur lors du chargement des recettes pour la catégorie ${category}:`, err);
      setError('Échec du chargement des recettes par catégorie. Veuillez réessayer.');
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    // L'useEffect gérera le chargement en fonction de la catégorie
  };

  const handleAddRecipe = async (recipeData) => {
    try {
      console.log('Soumission des données de recette:', recipeData);
      const response = await createRecipe(recipeData);
      console.log('Réponse de création de recette:', response);
      
      // Actualiser la liste des recettes en fonction du filtre de catégorie actuel
      if (categoryFilter === 'All') {
        await loadRecipes();
      } else if (categoryFilter === recipeData.category) {
        await loadRecipesByCategory(categoryFilter);
      } else {
        // Si la recette est d'une catégorie différente, passer à toutes les recettes
        setCategoryFilter('All');
        // loadRecipes sera appelé via useEffect en raison du changement de categoryFilter
      }
      
      setIsAddFormOpen(false);
    } catch (err) {
      console.error('Erreur lors de l\'ajout des détails de la recette:', err);
      setError('Échec de l\'ajout de la recette. Veuillez réessayer.');
    }
  };

  const handleEditClick = (recipe) => {
    setCurrentRecipe(recipe);
    setIsEditFormOpen(true);
  };

  const handleUpdateRecipe = async (updatedData) => {
    try {
      console.log('Mise à jour des données de recette:', updatedData);
      const response = await updateRecipe(currentRecipe._id, updatedData);
      console.log('Réponse de mise à jour de recette:', response);
      
      // Actualiser la liste des recettes en fonction du filtre de catégorie actuel
      if (categoryFilter === 'All') {
        await loadRecipes();
      } else if (categoryFilter === updatedData.category) {
        await loadRecipesByCategory(categoryFilter);
      } else {
        // Si la catégorie a changé et ne correspond plus au filtre actuel
        setCategoryFilter('All');
        // loadRecipes sera appelé via useEffect en raison du changement de categoryFilter
      }
      
      setIsEditFormOpen(false);
      setCurrentRecipe(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la recette:', err);
      setError('Échec de la mise à jour de la recette. Veuillez réessayer.');
    }
  };

  const handleDeleteRecipe = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      try {
        await deleteRecipe(id);
        
        // Actualiser la liste des recettes en fonction du filtre de catégorie actuel
        if (categoryFilter === 'All') {
          await loadRecipes();
        } else {
          await loadRecipesByCategory(categoryFilter);
        }
      } catch (err) {
        setError('Échec de la suppression de la recette. Veuillez réessayer.');
        console.error('Erreur lors de la suppression de la recette:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-pulse text-xl text-gray-600">Chargement des recettes...</div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'caterer') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-amber-100 border border-amber-400 text-amber-700 px-4 py-3 rounded mb-4">
          Seuls les traiteurs peuvent accéder et gérer les recettes.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Mes Recettes</h1>
        <button
          onClick={() => setIsAddFormOpen(true)}
          className="flex items-center bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-300"
        >
          <FiPlus className="mr-2" /> Ajouter une recette
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filtre de catégorie */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <FiFilter className="mr-2 text-amber-600" />
          <span className="font-medium text-gray-700">Filtrer par catégorie:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                categoryFilter === category 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Afficher les recettes ou l'état vide */}
      {Array.isArray(recipes) && recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <RecipeCard 
              key={recipe._id} 
              recipe={recipe} 
              onDelete={handleDeleteRecipe}
              onEdit={() => handleEditClick(recipe)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          {categoryFilter !== 'All' ? (
            <p className="text-gray-600 mb-4">Aucune recette trouvée dans la catégorie "{categoryFilter}".</p>
          ) : (
            <p className="text-gray-600 mb-4">Vous n'avez pas encore ajouté de recettes.</p>
          )}
          <button
            onClick={() => setIsAddFormOpen(true)}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-300"
          >
            Ajouter votre première recette
          </button>
        </div>
      )}

      {isAddFormOpen && (
        <RecipeForm 
          onSubmit={handleAddRecipe} 
          onCancel={() => setIsAddFormOpen(false)} 
        />
      )}

      {isEditFormOpen && currentRecipe && (
        <RecipeForm 
          initialData={currentRecipe}
          onSubmit={handleUpdateRecipe} 
          onCancel={() => {
            setIsEditFormOpen(false);
            setCurrentRecipe(null);
          }}
        />
      )}
    </div>
  );
}