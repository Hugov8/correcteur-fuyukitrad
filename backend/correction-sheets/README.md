# Générer les rapports d'erreurs sous format txt
## Installation
### Optionnel: Travailler avec un environnement python
#### Mise en place de l'environnement
```bash 
python3 -m venv env
```
#### Utiliser l'environnement
```bash
source env/bin/activate
```
### Installer les dépendances
```bash
pip install -r requirements.txt
```

## Pour un spreadsheet
```bash
python correcteur.py **lien vers la sheet**
```
## Pour plusieurs spreadsheet
Créer un fichier lien.txt en y ajoutant tous les liens, séparés par un retour à la ligne
```text
lien1
lien2
lien3
...
lien
```
Puis lancer la commande
```bash
python correcteur.py --all
```

Le rapport se trouvera dans le dossier [rapport](/rapport)

