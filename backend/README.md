# Backend Flask - BDIA E-commerce

Ce backend Flask remplace l'ancien backend Express.js tout en conservant la même API.

## Structure du projet

```
backend/
├── __init__.py          # Application factory Flask
├── config.py            # Configuration de l'application
├── models.py            # Modèles SQLAlchemy
├── controllers/         # Contrôleurs (logique métier)
│   ├── auth_controller.py
│   ├── product_controller.py
│   ├── seller_controller.py
│   ├── client_controller.py
│   └── photo_controller.py
├── routes/              # Routes Flask (Blueprints)
│   ├── auth_routes.py
│   ├── product_routes.py
│   ├── seller_routes.py
│   ├── client_routes.py
│   └── photo_routes.py
└── middleware/          # Middleware (JWT)
    └── auth_jwt.py
```

## Installation

1. Installer les dépendances Python :
```bash
pip install -r requirements.txt
```

2. Créer un fichier `.env` à la racine du projet (copier `.env.example`) :
```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=ecomerceDB
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET=jwt-secret-key-change-in-production
```

3. Créer la base de données MySQL :
```bash
mysql -u root -p < database.sql
```

4. Initialiser les migrations Flask-Migrate :
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

## Démarrage

```bash
python run.py
```

Le serveur démarre sur `http://127.0.0.1:8080`

## Endpoints API

Tous les endpoints de l'ancien backend Express sont conservés :

### Authentification (`/api/auth`)
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/` - Route protégée (nécessite JWT)

### Produits (`/api/product`)
- `GET /api/product/all` - Tous les produits
- `GET /api/product/spec/:sellerId` - Produits d'un vendeur
- `GET /api/product/search` - Recherche de produits
- `POST /api/product/add` - Ajouter un produit
- `DELETE /api/product/delete/:id` - Supprimer un produit
- `PUT /api/product/update/:id` - Mettre à jour un produit
- `PATCH /api/product/offer/:id` - Mettre à jour l'offre

### Vendeurs (`/api/seller`)
- `GET /api/seller/all` - Tous les vendeurs
- `GET /api/seller/:id` - Vendeur par ID
- `DELETE /api/seller/delete/:id` - Supprimer un vendeur
- `PATCH /api/seller/update/:id` - Mettre à jour un vendeur

### Clients (`/api/client`)
- `GET /api/client/all` - Tous les clients
- `GET /api/client/:id` - Client par ID
- `DELETE /api/client/delete/:id` - Supprimer un client
- `PATCH /api/client/update/:id` - Mettre à jour un client

### Photos (`/api/photos`)
- `POST /api/photos/upload/:productId` - Upload de photos (max 5)
- `GET /api/photos/:id` - Photos d'un produit

## Base de données

Le fichier `database.sql` contient toutes les requêtes SQL pour :
- DROP de l'ancienne base de données
- CREATE de la nouvelle base de données
- CREATE de toutes les tables avec contraintes, index et relations

## Migrations

Flask-Migrate est configuré pour gérer les migrations de la base de données :

```bash
# Créer une nouvelle migration
flask db migrate -m "Description de la migration"

# Appliquer les migrations
flask db upgrade

# Revenir en arrière
flask db downgrade
```


