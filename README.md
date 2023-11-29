# Application de Gestion des Utilisateurs pour le Festival du Jeu à Montpellier

## Run the project

```sh
npm start
```


## Create a page or a component

```sh
./ReactUtil.sh create <component|page> <sass?> <name>
```

## Variables globales et couleurs
Les variables globales et les couleurs sont définis dans le fichier *variables.module.scss* au chemin: 
```
src/styles/abstract/variables.module.scss
```

Les variables peuvent être importés comme ceci:
```ts
import variables from "./styles/abstract/variables.module.scss"`
```
et utilisées... 
```ts
variables.primaryColor
```

## Composant
Utiliser au maximum des composants MUI pour bénéficier d'une accessibilité accrue.   
Liste des composants: https://mui.com/components/

### Exemples

```ts
// Avant
<h1>Titre principal</h1>

// Après
import Typography from '@mui/material/Typography';

<Typography variant="h1">Titre principal</Typography>
```

```ts
// Avant
<div className="custom-container">Contenu de la boîte</div>

// Après
import Box from '@mui/material/Box';

<Box className="custom-container">Contenu de la boîte</Box>
```