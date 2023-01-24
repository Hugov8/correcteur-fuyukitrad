# Backend du correcteur
## Lancer avec python
### Correcteur orthographique
```bash
python correcteur/grammalecte-server.py
```
Accéder à la ressource à [l'adresse suivante](http://localhost:8080/)
### Récupérateur des sheets
#### Optionel: Lancer avec un environnement python
```bash
python3 -m venv env
source env/bin/activate
```
### Installer les dépendances
```bash
pip install -r correction-sheets/requirements.txt
```

### Lancer le service
```bash
python correction-sheets/index.py
```

Fermer en appuyant sur Ctrl+C

### Attention
Si les services sont lancés sans docker, remplacer la ligne 10 du fichier [correcteur.py](./correction-sheets/correcteur.py)
```python
URL_CORRECTEUR = "http://correcteur:8080/"
```
par 
```python
URL_CORRECTEUR = "http://localhost:8080/"
```

## Lancer avec Docker
### Construire l'application
```bash
docker-compose build
```
### Lancer les containers
```bash
docker-compose up
```

### Fermer les containers
Appuyer sur Ctrl+C et entrer
```bash
docker-compose down
```
### Attention
Si les services sont lancés avec docker, vérifier que la ligne 10 du fichier [correcteur.py](./correction-sheets/correcteur.py) correspond à
```python
URL_CORRECTEUR = "http://correcteur:8080/"
```
