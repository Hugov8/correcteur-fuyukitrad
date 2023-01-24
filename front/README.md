# React App pour le correcteur
## Construire l'application
```bash
npm install
npm run build
```
## Lancer l'application
```bash
npm run deploy
```
## Lancer l'application en developpement
```bash
npm run start
```
## Attention
Si l'application est lancé sans docker, modifier la ligne 4 du fichier [spreadsheet.tsx](./src/calls/spreadsheet.tsx), sans quoi une erreur s'affichera lors de la récupération des sheets
```typescript
const URL_CONNECTEUR = window.location.origin+"/connecteur"//"http://localhost:3030"
```
par 
```typescript
const URL_CONNECTEUR = "http://localhost:3030"
```
