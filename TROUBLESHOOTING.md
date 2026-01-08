# Guide de Résolution des Erreurs API

## Problèmes Courants et Solutions

### 1. Erreur 404 sur `/api/auth/login`
**Cause** : Le serveur backend n'est pas lancé ou n'écoute pas sur le bon port.

**Solution** :
```bash
# Depuis le dossier racine du projet
cd backend
python run.py
# OU depuis la racine
python run.py
```

Le serveur doit être accessible sur `http://127.0.0.1:8080`

### 2. Erreurs CORS (Cross-Origin Resource Sharing)
**Cause** : Le navigateur bloque les requêtes entre `localhost:5173` (frontend) et `127.0.0.1:8080` (backend).

**Solutions** :
- Vérifiez que le serveur backend est bien lancé
- Vérifiez que le serveur écoute sur le port 8080
- Vérifiez que les origines CORS dans `backend/config.py` incluent votre URL frontend
- Redémarrez le serveur backend après modification de la config CORS

### 3. Erreur 405 METHOD NOT ALLOWED
**Cause** : La méthode HTTP utilisée ne correspond pas à la route backend.

**Solutions vérifiées** :
- ✅ Les routes de review ont été corrigées : 
  - POST sur `/api/review/product/{product_id}` pour créer
  - PUT sur `/api/review/{review_id}` pour mettre à jour
  - DELETE sur `/api/review/{review_id}` pour supprimer

### 4. Erreur "Redirect is not allowed for a preflight request"
**Cause** : Le serveur redirige les requêtes OPTIONS (preflight CORS).

**Solution** : La configuration CORS a été améliorée dans `backend/__init__.py` pour gérer correctement les preflight requests.

## Vérification Rapide

1. **Backend fonctionne-t-il ?**
   ```bash
   curl http://127.0.0.1:8080/api/hello
   ```
   Devrait retourner `{"message": "Flask is running"}`

2. **Les routes sont-elles enregistrées ?**
   - Ouvrez `backend/__init__.py` et vérifiez que tous les blueprints sont enregistrés
   - Vérifiez que `run.py` utilise `create_app()` de `backend/__init__.py`

3. **Le frontend utilise-t-il les bonnes URLs ?**
   - Vérifiez que tous les appels API utilisent `http://127.0.0.1:8080/api/...`
   - Pas de `localhost` mais `127.0.0.1` pour éviter les problèmes de résolution DNS

## Commandes Utiles

```bash
# Lancer le backend
python run.py

# Lancer le frontend (dans un autre terminal)
cd client
npm run dev

# Vérifier les ports utilisés (Windows)
netstat -ano | findstr :8080
netstat -ano | findstr :5173
```

## Modifications Apportées

1. ✅ Correction de l'endpoint POST pour créer un review : `/api/review/product/{product_id}`
2. ✅ Amélioration de la configuration CORS pour gérer les preflight requests
3. ✅ Ajout des méthodes et headers autorisés dans CORS

## Si les Problèmes Persistent

1. Redémarrez complètement le serveur backend
2. Videz le cache du navigateur
3. Vérifiez les logs du serveur backend pour voir les erreurs exactes
4. Vérifiez que la base de données est accessible et configurée correctement
