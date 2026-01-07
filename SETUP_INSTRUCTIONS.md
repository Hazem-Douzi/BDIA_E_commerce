# Instructions d'Installation - Backend Flask

## Prérequis

- Python 3.8 ou supérieur
- MySQL installé et en cours d'exécution
- pip (gestionnaire de paquets Python)

## Installation rapide

### 1. Installer les dépendances Python

```bash
pip install -r requirements.txt
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=ecomerceDB
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET=jwt-secret-key-change-in-production
```

**Important** : 
- Si vous migrez depuis l'ancien backend Express, utilisez la **même valeur** pour `JWT_SECRET` pour que les tokens existants continuent de fonctionner.
- **Si c'est la première installation** (comme votre cas), générez une nouvelle clé sécurisée :
  ```bash
  python generate_jwt_secret.py
  ```
  Cela générera une clé aléatoire sécurisée que vous pourrez copier dans votre `.env`

### 3. Créer la base de données MySQL

Exécutez le script SQL :

```bash
mysql -u root -p < database.sql
```

Ou sur Windows avec MySQL en ligne de commande :

```bash
mysql -u root -p
source database.sql
```

### 4. Initialiser Flask-Migrate (optionnel mais recommandé)

```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### 5. Démarrer le serveur

```bash
python run.py
```

Le serveur démarre sur `http://127.0.0.1:8080`

## Vérification

Testez que le serveur fonctionne :

```bash
curl http://localhost:8080/api/product/all
```

## Structure des fichiers créés

```
.
├── database.sql              # Script SQL complet (DROP + CREATE)
├── run.py                    # Point d'entrée de l'application
├── requirements.txt          # Dépendances Python
├── .flaskenv                 # Configuration Flask
├── backend/
│   ├── __init__.py          # Application factory
│   ├── config.py            # Configuration
│   ├── models.py            # Modèles SQLAlchemy
│   ├── controllers/         # Logique métier
│   ├── routes/              # Routes Flask (Blueprints)
│   └── middleware/          # Middleware JWT
├── MIGRATION_GUIDE.md        # Guide de migration Express → Flask
└── backend/README.md         # Documentation du backend
```

## Commandes utiles

### Migrations Flask-Migrate

```bash
# Créer une nouvelle migration
flask db migrate -m "Description"

# Appliquer les migrations
flask db upgrade

# Revenir en arrière
flask db downgrade
```

### Base de données MySQL

```bash
# Se connecter à MySQL
mysql -u root -p

# Voir les bases de données
SHOW DATABASES;

# Utiliser la base de données
USE ecomerceDB;

# Voir les tables
SHOW TABLES;

# Voir la structure d'une table
DESCRIBE products;
```

## Dépannage

### Erreur : "ModuleNotFoundError: No module named 'backend'"

Assurez-vous d'être à la racine du projet et que Python peut trouver le module backend.

### Erreur : "Access denied for user 'root'@'localhost'"

Vérifiez les identifiants MySQL dans le fichier `.env`.

### Erreur : "Unknown database 'ecomerceDB'"

Exécutez le script `database.sql` pour créer la base de données.

### Erreur : "Table already exists"

La base de données existe déjà. Vous pouvez soit :
- Supprimer la base : `DROP DATABASE ecomerceDB;`
- Ou utiliser la base existante (assurez-vous que la structure correspond)

## Support

Consultez :
- `MIGRATION_GUIDE.md` pour la migration depuis Express.js
- `backend/README.md` pour la documentation complète de l'API

