/**
 * API service pour les produits
 * Toutes les requêtes API pour les produits sont centralisées ici
 */
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8080/api/product";

/**
 * Recherche de produits avec filtres SQL côté backend
 * @param {Object} params - Paramètres de recherche et filtres
 * @returns {Promise} Réponse de l'API avec produits et pagination
 */
export const searchProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Ajouter tous les paramètres de filtrage
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/search?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

/**
 * Obtenir tous les produits
 */
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/All`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

/**
 * Obtenir un produit par ID
 */
export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

/**
 * Obtenir les produits d'un vendeur
 */
export const getProductsBySeller = async (sellerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/spec/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching seller products:", error);
    throw error;
  }
};

// Fonctions de filtrage (maintenant dépréciées - utiliser searchProducts à la place)
// Conservées pour compatibilité mais redirigent vers searchProducts

export const searchByname = async (term) => {
  return searchProducts({ search: term });
};

export const filterByBrand = async (term) => {
  return searchProducts({ brand: term });
};

export const filterByCategory = async (category) => {
  return searchProducts({ category });
};

export const filterByminMaxPrice = async (minPrice, maxPrice) => {
  return searchProducts({ minPrice, maxPrice });
};

export const filterByAvailable = async (available) => {
  return searchProducts({ stock: available ? 'available' : 'out' });
};

export const filterByDate = async (date) => {
  // Implémentation si nécessaire
  return searchProducts({});
};
