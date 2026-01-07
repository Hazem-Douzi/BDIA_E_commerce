"""
Script pour générer une clé JWT_SECRET sécurisée
Exécutez ce script pour générer une nouvelle clé aléatoire
"""
import secrets

def generate_jwt_secret():
    """Génère une clé JWT_SECRET sécurisée de 32 bytes"""
    jwt_secret = secrets.token_urlsafe(32)
    print("=" * 60)
    print("Votre nouvelle clé JWT_SECRET générée :")
    print("=" * 60)
    print(jwt_secret)
    print("=" * 60)
    print("\nCopiez cette valeur dans votre fichier .env :")
    print(f"JWT_SECRET={jwt_secret}")
    print("\n⚠️  IMPORTANT : Gardez cette clé secrète et ne la partagez jamais !")
    return jwt_secret

if __name__ == '__main__':
    generate_jwt_secret()


