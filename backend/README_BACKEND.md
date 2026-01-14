# RED Product - Backend Django

## 📁 Structure complète des fichiers

```
backend/
├── red_product/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── accounts/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── migrations/
│   │   └── __init__.py
│   └── tests.py
├── hotels/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── migrations/
│   │   └── __init__.py
│   └── tests.py
├── media/
│   └── hotels/
├── staticfiles/
├── .env
├── .env.example
├── .gitignore
├── manage.py
├── requirements.txt
├── build.sh
├── render.yaml
└── README.md
```

## 🚀 Installation pas à pas

### 1. Créer la structure

```bash
mkdir red-product
cd red-product
mkdir backend
cd backend
```

### 2. Créer l'environnement virtuel

```bash
python -m venv venv

# Sur Windows
venv\Scripts\activate

# Sur Linux/Mac
source venv/bin/activate
```

### 3. Créer requirements.txt

```txt
Django==4.2.8
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1
django-cors-headers==4.3.1
psycopg2-binary==2.9.9
Pillow==10.1.0
python-decouple==3.8
gunicorn==21.2.0
whitenoise==6.6.0
django-filter==23.5
```

### 4. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 5. Créer le projet Django

```bash
django-admin startproject red_product .
python manage.py startapp accounts
python manage.py startapp hotels
```

### 6. Copier tous les fichiers des artifacts

Copiez le contenu de chaque artifact dans le fichier correspondant :

- `settings.py` → `red_product/settings.py`
- `urls.py` (principal) → `red_product/urls.py`
- `wsgi.py` → `red_product/wsgi.py`
- `models.py` (accounts) → `accounts/models.py`
- `serializers.py` (accounts) → `accounts/serializers.py`
- `views.py` (accounts) → `accounts/views.py`
- `urls.py` (accounts) → `accounts/urls.py`
- `admin.py` (accounts) → `accounts/admin.py`
- `apps.py` (accounts) → `accounts/apps.py`
- `models.py` (hotels) → `hotels/models.py`
- `serializers.py` (hotels) → `hotels/serializers.py`
- `views.py` (hotels) → `hotels/views.py`
- `urls.py` (hotels) → `hotels/urls.py`
- `admin.py` (hotels) → `hotels/admin.py`
- `apps.py` (hotels) → `hotels/apps.py`

### 7. Configurer la base de données PostgreSQL

#### Option A: Installation locale PostgreSQL

**Windows:**
```bash
# Télécharger depuis https://www.postgresql.org/download/windows/
# Installer et démarrer le service

# Créer la base de données
psql -U postgres
CREATE DATABASE red_product;
CREATE USER red_product_user WITH PASSWORD 'votre_mot_de_passe';
ALTER ROLE red_product_user SET client_encoding TO 'utf8';
ALTER ROLE red_product_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE red_product_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE red_product TO red_product_user;
\q
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Créer la base de données
sudo -u postgres psql
CREATE DATABASE red_product;
CREATE USER red_product_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE red_product TO red_product_user;
\q
```

**Mac:**
```bash
brew install postgresql@14
brew services start postgresql@14

# Créer la base de données
psql postgres
CREATE DATABASE red_product;
CREATE USER red_product_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE red_product TO red_product_user;
\q
```

#### Option B: Docker PostgreSQL (Recommandé)

```bash
docker run --name red-product-db \
  -e POSTGRES_DB=red_product \
  -e POSTGRES_USER=red_product_user \
  -e POSTGRES_PASSWORD=votre_mot_de_passe \
  -p 5432:5432 \
  -d postgres:14
```

### 8. Créer le fichier .env

```bash
# Copier l'exemple
cp .env.example .env

# Éditer avec vos valeurs
nano .env
```

### 9. Effectuer les migrations

```bash
# Créer les migrations
python manage.py makemigrations accounts
python manage.py makemigrations hotels

# Appliquer les migrations
python manage.py migrate
```

### 10. Créer un superutilisateur

```bash
python manage.py createsuperuser
# Email: admin@redproduct.com
# Username: admin
# Password: VotreMotDePasse123!
```

### 11. Créer les dossiers media

```bash
mkdir media
mkdir media/hotels
mkdir staticfiles
```

### 12. Collecter les fichiers statiques

```bash
python manage.py collectstatic --noinput
```

### 13. Lancer le serveur

```bash
python manage.py runserver
```

Le serveur démarre sur `http://127.0.0.1:8000`

## 🧪 Tester l'API

### Avec curl

```bash
# Inscription
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User",
    "password": "TestPass123!",
    "password2": "TestPass123!"
  }'

# Connexion
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@redproduct.com",
    "password": "VotreMotDePasse123!"
  }'

# Récupérer le token et l'utiliser
TOKEN="votre_access_token_ici"

# Lister les hôtels
curl http://localhost:8000/api/hotels/ \
  -H "Authorization: Bearer $TOKEN"

# Créer un hôtel (admin uniquement)
curl -X POST http://localhost:8000/api/hotels/ \
  -H "Authorization: Bearer $TOKEN" \
  -F "nom=Hôtel Test" \
  -F "adresse=123 Rue Test" \
  -F "email=hotel@test.com" \
  -F "telephone=+221771234567" \
  -F "prix_par_nuit=25000" \
  -F "devise=XOF" \
  -F "image=@/chemin/vers/image.jpg"
```

### Avec Postman ou Insomnia

Importez cette collection :

```json
{
  "info": {
    "name": "RED Product API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"username\": \"testuser\",\n  \"first_name\": \"Test\",\n  \"last_name\": \"User\",\n  \"password\": \"TestPass123!\",\n  \"password2\": \"TestPass123!\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "http://localhost:8000/api/auth/register/",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8000",
              "path": ["api", "auth", "register", ""]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@redproduct.com\",\n  \"password\": \"VotreMotDePasse123!\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "http://localhost:8000/api/auth/login/",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8000",
              "path": ["api", "auth", "login", ""]
            }
          }
        }
      ]
    },
    {
      "name": "Hotels",
      "item": [
        {
          "name": "List Hotels",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "http://localhost:8000/api/hotels/",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8000",
              "path": ["api", "hotels", ""]
            }
          }
        }
      ]
    }
  ]
}
```

## 📊 Accéder à l'admin Django

1. Ouvrez `http://localhost:8000/admin`
2. Connectez-vous avec vos identifiants superuser
3. Gérez les utilisateurs et hôtels via l'interface admin

## 🔧 Commandes utiles

```bash
# Créer des migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un superuser
python manage.py createsuperuser

# Lancer le shell Django
python manage.py shell

# Lancer les tests
python manage.py test

# Collecter les fichiers statiques
python manage.py collectstatic

# Vider la base de données
python manage.py flush

# Créer des données de test
python manage.py loaddata fixtures.json
```

## 🐛 Dépannage

### Erreur: "No module named 'accounts'"

```bash
# Vérifier que les apps sont dans INSTALLED_APPS
python manage.py check
```

### Erreur: "relation does not exist"

```bash
# Supprimer les migrations et recréer
rm accounts/migrations/0*.py
rm hotels/migrations/0*.py
python manage.py makemigrations
python manage.py migrate
```

### Erreur PostgreSQL connection

```bash
# Vérifier que PostgreSQL est démarré
sudo systemctl status postgresql  # Linux
brew services list                # Mac

# Vérifier les credentials dans .env
```

## 📝 API Endpoints

### Authentification
- `POST /api/auth/register/` - Inscription
- `POST /api/auth/login/` - Connexion
- `POST /api/auth/logout/` - Déconnexion
- `POST /api/auth/token/refresh/` - Rafraîchir le token
- `GET/PUT /api/auth/profile/` - Profil utilisateur
- `POST /api/auth/change-password/` - Changer mot de passe
- `POST /api/auth/password-reset/` - Réinitialiser mot de passe

### Hôtels
- `GET /api/hotels/` - Liste des hôtels
- `POST /api/hotels/` - Créer un hôtel (admin)
- `GET /api/hotels/{id}/` - Détail d'un hôtel
- `PUT /api/hotels/{id}/` - Modifier un hôtel (admin)
- `PATCH /api/hotels/{id}/` - Modifier partiellement (admin)
- `DELETE /api/hotels/{id}/` - Supprimer un hôtel (admin)
- `GET /api/hotels/mes_hotels/` - Mes hôtels
- `GET /api/hotels/statistiques/` - Statistiques

## 🚀 Déploiement sur Render

1. Créer un compte sur [render.com](https://render.com)
2. Créer une nouvelle base PostgreSQL
3. Créer un nouveau Web Service
4. Connecter votre repository GitHub
5. Configurer:
   - Build Command: `./build.sh`
   - Start Command: `gunicorn red_product.wsgi:application`
6. Ajouter les variables d'environnement
7. Déployer !

## 📚 Ressources

- [Django Documentation](https://docs.djangoproject.com/)
- [DRF Documentation](https://www.django-rest-framework.org/)
- [SimpleJWT Documentation](https://django-rest-framework-simplejwt.readthedocs.io/)