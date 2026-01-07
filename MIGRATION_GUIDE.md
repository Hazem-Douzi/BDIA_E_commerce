# Guide de Migration - Express.js vers Flask

Ce guide explique comment migrer de l'ancien backend Express.js vers le nouveau backend Flask.

## Étapes de migration

### 1. Sauvegarder les données existantes (optionnel)

Si vous avez des données importantes dans l'ancienne base de données, exportez-les avant de continuer :

```bash
mysqldump -u root -p ecomerceDB > backup.sql
```

### 2. Arrêter l'ancien serveur Express

Arrêtez le serveur Express.js s'il est en cours d'exécution.

### 3. Installer les dépendances Python

```bash
pip install -r requirements.txt
```

### 4. Créer le fichier .env

Créez un fichier `.env` à la racine du projet avec :

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=ecomerceDB
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET=jwt-secret-key-change-in-production
```

**Important**: Utilisez la même valeur pour `JWT_SECRET` que dans votre ancien backend Express pour que les tokens existants continuent de fonctionner.

### 5. Supprimer et recréer la base de données

Exécutez le script SQL pour supprimer l'ancienne base et créer la nouvelle :

```bash
mysql -u root -p < database.sql
```

Ou utilisez le script Python :

```bash
python init_db.py
```

### 6. Initialiser Flask-Migrate

```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### 7. Démarrer le nouveau serveur Flask

```bash
python run.py
```

Le serveur démarre sur `http://127.0.0.1:8080` (même port que l'ancien backend).

## Compatibilité API

Tous les endpoints de l'ancien backend Express sont conservés :

- ✅ Mêmes URLs
- ✅ Mêmes méthodes HTTP
- ✅ Mêmes formats de requête
- ✅ Mêmes formats de réponse
- ✅ Mêmes codes HTTP
- ✅ Même authentification JWT

Le frontend JavaScript n'a besoin d'aucune modification.

## Différences techniques

### Base de données
- **Ancien**: Sequelize ORM (Node.js)
- **Nouveau**: SQLAlchemy ORM (Python)

### Authentification
- **Ancien**: `jsonwebtoken` (Node.js)
- **Nouveau**: `PyJWT` (Python)
- Les tokens JWT sont compatibles si vous utilisez le même `JWT_SECRET`

### Upload de fichiers
- **Ancien**: Multer (Node.js)
- **Nouveau**: Werkzeug (Flask)
- Même comportement : max 5 images par produit

## Vérification

Testez les endpoints principaux :

1. **Inscription**:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","fullName":"Test User","role":"client"}'
```

2. **Connexion**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

3. **Liste des produits**:
```bash
curl http://localhost:8080/api/product/all
```

## Dépannage

### Erreur de connexion à la base de données
- Vérifiez que MySQL est démarré
- Vérifiez les identifiants dans `.env`
- Vérifiez que la base de données existe : `mysql -u root -p -e "SHOW DATABASES;"`

### Erreur d'import
- Vérifiez que toutes les dépendances sont installées : `pip list`
- Réinstallez les dépendances : `pip install -r requirements.txt`

### Erreur de migration
- Supprimez le dossier `migrations` et réinitialisez : `flask db init`
- Vérifiez que la base de données est vide ou utilisez `flask db stamp head`

## Support

En cas de problème, vérifiez :
1. Les logs du serveur Flask
2. Les logs MySQL
3. La configuration dans `.env`
4. La structure de la base de données : `mysql -u root -p ecomerceDB -e "SHOW TABLES;"`


