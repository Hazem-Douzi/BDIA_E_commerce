/**
 * Utilitaire centralisé pour les appels API
 * Gère automatiquement les URLs selon l'environnement (dev/prod)
 */

// Détermine l'URL de base de l'API selon l'environnement
const getApiBaseUrl = () => {
  // En développement (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8080/api';
  }
  // En production, utilise une URL relative (même domaine)
  return '/api';
};

// Détermine l'URL de base pour les uploads/images
const getUploadBaseUrl = () => {
  // En développement
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8080';
  }
  // En production, utilise une URL relative
  return '';
};

export const API_BASE_URL = getApiBaseUrl();
export const UPLOAD_BASE_URL = getUploadBaseUrl();

/**
 * Construit une URL complète pour une route API
 * @param {string} path - Chemin relatif de l'API (ex: '/auth/login')
 * @returns {string} URL complète
 */
export const buildApiUrl = (path) => {
  // Enlève le slash initial si présent pour éviter les doubles slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

/**
 * Construit une URL complète pour un fichier uploadé
 * @param {string} filename - Nom du fichier ou chemin relatif
 * @returns {string} URL complète
 */
export const buildUploadUrl = (filename) => {
  if (!filename) return '';
  
  // Si c'est déjà une URL complète (http/https), la retourner telle quelle
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  // Enlève le slash initial si présent
  const cleanPath = filename.startsWith('/') ? filename : `/${filename}`;
  return `${UPLOAD_BASE_URL}/uploads${cleanPath}`;
};
