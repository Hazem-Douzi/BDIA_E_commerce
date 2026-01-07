# Résumé du Projet E-Commerce BDIA

## Vue d'ensemble

Ce projet est une application e-commerce complète construite avec Flask (backend) et React (frontend), basée sur le schéma SQL fourni dans `E-Commerce-BD.sql`.

## Structure du Backend

### Modèles SQLAlchemy (backend/models.py)

Tous les modèles correspondent exactement au schéma SQL :
- **User** : Utilisateurs unifiés (admin, client, seller)
- **Category** : Catégories de produits
- **SubCategory** : Sous-catégories
- **Product** : Produits avec images
- **ProductImage** : Images des produits
- **Review** : Avis et notes
- **Cart** : Paniers clients
- **CartItem** : Articles du panier
- **Order** : Commandes
- **OrderItem** : Articles de commande
- **Payment** : Paiements
- **SellerProfile** : Profils des vendeurs

### Contrôleurs

1. **auth_controller.py** : Authentification (register, login)
2. **admin_controller.py** : Gestion admin (users, categories, products, orders)
3. **product_controller.py** : Gestion des produits
4. **seller_controller.py** : Profil et stats vendeur
5. **client_controller.py** : Profil client
6. **cart_controller.py** : Gestion du panier
7. **order_controller.py** : Gestion des commandes
8. **review_controller.py** : Gestion des avis
9. **payment_controller.py** : Gestion des paiements
10. **photo_controller.py** : Upload d'images

### Routes API

- `/api/auth/*` : Authentification
- `/api/admin/*` : Routes admin (protégées)
- `/api/product/*` : Produits
- `/api/seller/*` : Vendeurs
- `/api/client/*` : Clients
- `/api/cart/*` : Panier
- `/api/order/*` : Commandes
- `/api/review/*` : Avis
- `/api/payment/*` : Paiements
- `/api/category/*` : Catégories (publiques)
- `/api/photos/*` : Upload d'images

## Installation et Configuration

### Prérequis

1. Python 3.8+
2. MySQL
3. Node.js 16+
4. npm ou yarn

### Configuration Backend

1. Installer les dépendances Python :
```bash
pip install -r requirements.txt
```

2. Créer un fichier `.env` à la racine :
```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=votre_mot_de_passe
MYSQL_DATABASE=ECommerce
SECRET_KEY=votre-secret-key
JWT_SECRET=votre-jwt-secret
```

3. Créer la base de données MySQL :
```bash
mysql -u root -p < E-Commerce-BD.sql
```

4. Initialiser les migrations Flask :
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

5. Lancer le serveur Flask :
```bash
python run.py
```
Le serveur démarre sur `http://127.0.0.1:8080`

### Configuration Frontend

1. Aller dans le dossier client :
```bash
cd client
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer le serveur de développement :
```bash
npm run dev
```
Le client démarre sur `http://localhost:5173`

## Fonctionnalités Implémentées

### Admin
- ✅ Dashboard avec statistiques
- ✅ Gestion des utilisateurs (clients, vendeurs)
- ✅ Gestion des catégories et sous-catégories
- ✅ Gestion des produits
- ✅ Vérification des vendeurs
- ✅ Gestion des commandes
- ✅ Statuts des commandes

### Vendeur
- ✅ Profil vendeur avec boutique
- ✅ Gestion des produits (ajout, modification, suppression)
- ✅ Voir les commandes de ses produits
- ✅ Statistiques (revenus, produits, commandes)

### Client
- ✅ Parcourir les produits
- ✅ Recherche et filtrage
- ✅ Panier d'achat
- ✅ Commandes
- ✅ Paiements (card, cash_on_delivery, flouci)
- ✅ Avis et notes sur les produits
- ✅ Profil client

## Points Importants

1. **Authentification JWT** : Toutes les routes protégées utilisent JWT
2. **Rôles** : Trois rôles (admin, seller, client) avec permissions appropriées
3. **Upload d'images** : Les images sont stockées dans `backend/server/uploads`
4. **Base de données** : Schéma unifié avec table `users` et rôle `rolee`

## Notes de Développement

- Les routes admin nécessitent le rôle `admin`
- Les routes seller nécessitent le rôle `seller`
- Les routes client nécessitent le rôle `client`
- Les routes publiques sont accessibles sans authentification

## Prochaines Étapes (Optionnelles)

- Intégration réelle de paiement (Flouci, Stripe)
- Système de notifications
- Chat en temps réel
- Analytics avancées
- Export de données

