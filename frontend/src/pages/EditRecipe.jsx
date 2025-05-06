import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import RecipeForm from '../components/RecipeForm';
import { fetchRecipe, updateRecipe } from '../utils/api';

export default function EditRecipe() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setLoading(true);
        const response = await fetchRecipe(id);
        // Si la recette n'a pas encore de champ de catégorie, ajouter la valeur par défaut
        const recipeData = response.data && response.data.data ? response.data.data : response.data;
        
        if (!recipeData.category) {
          recipeData.category = 'Uncategorized';
        }
        
        setRecipe(recipeData);
        setIsFormOpen(true);
        setError(null);
      } catch (err) {
        setError('Échec du chargement des détails de la recette pour la modification.');
        console.error('Erreur lors du chargement de la recette:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  const handleSubmit = async (updatedRecipe) => {
    try {
      await updateRecipe(id, updatedRecipe);
      navigate(`/my-recipes/${id}`);
    } catch (err) {
      setError('Échec de la mise à jour de la recette. Veuillez réessayer.');
      console.error('Erreur lors de la mise à jour de la recette:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-pulse text-xl text-gray-600">Chargement de la recette...</div>
      </div>
    );
  }

  if (error && !recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/my-recipes')}
          className="mt-4 flex items-center text-amber-600 hover:text-amber-800"
        >
          <FiArrowLeft className="mr-2" /> Retour à Mes Recettes
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(`/my-recipes/${id}`)}
        className="mb-6 flex items-center text-amber-600 hover:text-amber-800"
      >
        <FiArrowLeft className="mr-2" /> Retour à la Recette
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isFormOpen && recipe && (
        <RecipeForm 
          initialData={recipe}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/my-recipes/${id}`)}
        />
      )}
    </div>
  );
}