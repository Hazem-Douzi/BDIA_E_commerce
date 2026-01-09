# Fix CORS et URLs Hardcodées pour Vercel

## Problème
Lors du déploiement sur Vercel, vous obtenez des erreurs CORS car :
1. Le frontend utilise des URLs hardcodées `http://127.0.0.1:8080` qui ne fonctionnent pas en production
2. Le backend n'autorise pas les origines Vercel dans CORS

## Solution

### 1. Configuration CORS (DÉJÀ FAIT ✅)
Le backend accepte maintenant toutes les origines si `CORS_ORIGINS=*` est défini dans les variables d'environnement Vercel.

**Dans Vercel Dashboard → Settings → Environment Variables, ajoutez :**
```
CORS_ORIGINS=*
```

### 2. Remplacement des URLs Hardcodées

#### ✅ Fichiers déjà corrigés :
- `client/src/login.jsx`
- `client/src/register.jsx`
- `client/src/App.jsx`

#### 📝 Fichiers à corriger manuellement :

**Pages Client :**
- `client/src/pages/client/HomePage.jsx`
- `client/src/pages/client/ProductList.jsx`
- `client/src/pages/client/ProductDetail.jsx`
- `client/src/pages/client/Profile.jsx`
- `client/src/pages/client/UpdateProfile.jsx`
- `client/src/pages/client/CheckoutPage.jsx`
- `client/src/pages/client/PaymentPage.jsx`
- `client/src/pages/client/CheckoutSuccessPage.jsx`

**Pages Seller :**
- `client/src/pages/seller/*.jsx`

**Pages Admin :**
- `client/src/pages/admin/*.jsx`

**Composants :**
- `client/src/components/layout/Navbar.jsx`

**Autres :**
- `client/src/pages/auth/Login.jsx`
- `client/src/pages/auth/Register.jsx`

### 3. Instructions de Remplacement

Pour chaque fichier, remplacez :

1. **URLs API :**
   ```javascript
   // AVANT
   axios.get('http://127.0.0.1:8080/api/product/All')
   
   // APRÈS
   import { buildApiUrl } from '../../utils/api'; // (ou le chemin relatif approprié)
   axios.get(buildApiUrl('/product/All'))
   ```

2. **URLs Uploads/Images :**
   ```javascript
   // AVANT
   src={`http://127.0.0.1:8080/uploads/${imageUrl}`}
   
   // APRÈS
   import { buildUploadUrl } from '../../utils/api';
   src={buildUploadUrl(imageUrl)}
   ```

3. **Template Literals :**
   ```javascript
   // AVANT
   src={image.startsWith('http') ? image : `http://127.0.0.1:8080/uploads/${image}`}
   
   // APRÈS
   src={image.startsWith('http') ? image : buildUploadUrl(image)}
   ```

### 4. Vérification

Après les corrections, testez que :
- ✅ Toutes les requêtes API fonctionnent
- ✅ Toutes les images s'affichent
- ✅ Pas d'erreurs CORS dans la console

### 5. Variable d'Environnement Vercel

**IMPORTANT :** N'oubliez pas d'ajouter dans Vercel Dashboard :
```
CORS_ORIGINS=*
```

Cela permet au backend d'accepter les requêtes depuis n'importe quelle origine (nécessaire car le frontend et le backend sont sur le même domaine via les rewrites Vercel).
