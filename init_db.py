"""
Script pour initialiser la base de données MySQL
Ce script exécute le fichier E-Commerce-BD.sql pour créer la base de données
"""
import subprocess
import sys
import os

def init_database():
    """Initialise la base de données MySQL en exécutant E-Commerce-BD.sql"""
    sql_file = os.path.join(os.path.dirname(__file__), 'E-Commerce-BD.sql')
    
    if not os.path.exists(sql_file):
        print(f"Erreur: Le fichier {sql_file} n'existe pas")
        sys.exit(1)
    
    print("Initialisation de la base de données MySQL...")
    print(f"Exécution du script: {sql_file}")
    
    try:
        # Commande MySQL (Windows)
        # Pour Linux/Mac, utiliser: mysql -u root -p < E-Commerce-BD.sql
        with open(sql_file, 'r', encoding='utf-8') as f:
            result = subprocess.run(
                ['mysql', '-u', 'root', '-p'],
                stdin=f,
                capture_output=True,
                text=True
            )
        
        if result.returncode == 0:
            print("✓ Base de données initialisée avec succès!")
        else:
            print(f"Erreur lors de l'initialisation:")
            print(result.stderr)
            sys.exit(1)
            
    except FileNotFoundError:
        print("Erreur: MySQL n'est pas installé ou n'est pas dans le PATH")
        print("Veuillez exécuter manuellement:")
        print(f"  mysql -u root -p < {sql_file}")
        sys.exit(1)
    except Exception as e:
        print(f"Erreur: {e}")
        sys.exit(1)

if __name__ == '__main__':
    init_database()