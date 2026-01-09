# Guide de déploiement sur Vercel

## Configuration requise

### Variables d'environnement à configurer sur Vercel

Allez dans les paramètres du projet Vercel et configurez les variables d'environnement suivantes :

```
SECRET_KEY=votre-secret-key-production
JWT_SECRET=votre-jwt-secret-production
MYSQL_HOST=votre-host-mysql
MYSQL_USER=votre-user-mysql
MYSQL_PASSWORD=votre-password-mysql
MYSQL_DATABASE=ECommerce
```

### Structure du projet

- `api/index.py` : Point d'entrée Flask pour Vercel
- `vercel.json` : Configuration Vercel pour le routing
- `requirements.txt` : Dépendances Python (à la racine)
- `backend/` : Code source Flask
- `client/` : Application React frontend

### Routes configurées

- `/api/*` → Routé vers Flask (api/index.py)
- `/uploads/*` → Routé vers Flask pour les fichiers uploadés
- `/*` → Routé vers le frontend React (client/dist)

### Build

Le build se fait automatiquement :
1. Frontend : `cd client && npm install && npm run build`
2. Backend : Détection automatique via `api/index.py`

### Notes importantes

- Assurez-vous que votre base de données MySQL est accessible depuis Vercel
- Les fichiers uploadés seront stockés dans `/server/uploads` (considérez utiliser un service de stockage cloud pour la production)
- Les CORS sont configurés dans `backend/config.py` - ajoutez votre domaine Vercel si nécessaire
