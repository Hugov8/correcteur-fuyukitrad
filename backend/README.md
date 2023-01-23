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
```bash
docker-compose down
```

