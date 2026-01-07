# Comment trouver la valeur JWT_SECRET

## Où se trouve JWT_SECRET dans l'ancien backend Express ?

Dans l'ancien backend Express, `JWT_SECRET` est défini dans un fichier `.env` qui se trouve généralement :
- À la racine du projet (même niveau que `server/`)
- Ou dans le dossier `server/`

Ce fichier `.env` n'est généralement **pas versionné** (dans `.gitignore`) pour des raisons de sécurité.

## Comment trouver votre valeur JWT_SECRET actuelle ?

### Option 1 : Vérifier si le fichier .env existe

Cherchez un fichier `.env` dans :
1. Le dossier racine du projet
2. Le dossier `server/`

```bash
# Windows PowerShell
Get-ChildItem -Path . -Filter ".env" -Recurse -Force

# Linux/Mac
find . -name ".env" -type f
```

### Option 2 : Vérifier les variables d'environnement système

Si vous avez défini `JWT_SECRET` comme variable d'environnement système :

```bash
# Windows PowerShell
$env:JWT_SECRET

# Windows CMD
echo %JWT_SECRET%

# Linux/Mac
echo $JWT_SECRET
```

### Option 3 : Vérifier dans le code en cours d'exécution

Si votre serveur Express est en cours d'exécution, regardez la console. Dans `server/index.js`, il y a :
```javascript
console.log("JWT_SECRET =", process.env.JWT_SECRET);
```

Cela affichera la valeur dans la console du serveur.

### Option 4 : Si vous n'avez pas de JWT_SECRET

Si vous n'avez jamais créé de fichier `.env` ou défini `JWT_SECRET`, alors :
- L'ancien backend utilisait probablement `undefined` ou une valeur par défaut
- **Vous pouvez créer une nouvelle valeur** pour le nouveau backend Flask

## Configuration pour le nouveau backend Flask

### Si vous avez trouvé votre ancienne valeur JWT_SECRET :

Créez un fichier `.env` à la racine du projet avec :

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=ecomerceDB
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET=votre-ancienne-valeur-ici
```

**Important** : Utilisez la même valeur que l'ancien backend pour que les tokens JWT existants continuent de fonctionner.

### Si vous n'avez pas d'ancienne valeur :

Créez un fichier `.env` avec une nouvelle valeur sécurisée :

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=ecomerceDB
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET=une-cle-secrete-longue-et-aleatoire-changez-moi
```

**Générer une clé sécurisée** :

```python
# Python
import secrets
print(secrets.token_urlsafe(32))
```

```javascript
// Node.js
require('crypto').randomBytes(32).toString('hex')
```

## ⚠️ Important

- **Si vous changez JWT_SECRET** : Tous les tokens JWT existants deviendront invalides. Les utilisateurs devront se reconnecter.
- **Si vous gardez la même valeur** : Les tokens existants continueront de fonctionner.

## Vérification

Pour vérifier que votre `.env` est bien lu par Flask, vous pouvez temporairement ajouter dans `run.py` :

```python
from backend import create_app
import os
from dotenv import load_dotenv

load_dotenv()
print("JWT_SECRET =", os.environ.get('JWT_SECRET'))

app = create_app()
# ...
```


