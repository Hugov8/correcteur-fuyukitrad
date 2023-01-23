# Correcteur FuyukiTrad
## Pour lancer avec docker-compose
Pour construire les images
```bash
docker-compose build
```
Pour lancer les images
```bash
docker-compose up
```
ou pour faire les deux opérations
```bash
docker-compose up --build
```
Accéder à l'application via [l'adresse suivante](http://localhost:3050/)

Les routes [/connecteur](http://localhost:3050/connecteur) et [/correcteur](http://localhost:3050/correcteur) permettent d'accéder aux services du backend.

## Fermeture des images
Pour fermer les containers appuyer sur Ctrl+C et entrez
```bash
docker-compose down
```

# Générer les rapports d'erreurs
[voir README correspondant](/backend/correction-sheets/README.md)

# Attention
Pour fonctionner, il faut mettre un fichier client_secret.json dans le dossier [correction-sheets](/backend/correction-sheets/). Celui-ci peut être généré en passant par [le cloud google](https://console.cloud.google.com)