# Application de Gestion des Utilisateurs pour le Festival du Jeu à Montpellier

## Lancer le projet

```sh
npm start
```


## Créer une page ou un composant

```sh
./ReactUtil.sh
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

## Composants MUI
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

## Development Workflow

1. **Clone the Repository:**

```sh
git clone <repository-url>
cd <repository-name>
```

2. **Create a new branch:**

```sh
git checkout -b <user-storie-name>
```
> Note: 1 branch must corresponding to 1 user storie on Trello

3. **Commit Changes:**

```sh
git add .
git commit -m "feat: Description of the feature"
```

4. **Push to the Remote Repository:**

```sh
git push origin <user-storie-name>
```

5. **Review the code with the team**

6. **Merge the code into the main**
> Note: Resolve any merge conflicts if necessary.

## Responsive design

Copy and paste this code to apply media queries on your components/pages:

```scss
@import "./abstract/variables.module.scss";

/* MEDIA QUERIES */
/* DEFAULT */
/* Extra small devices (phones, $breakpointXS and down) */
@media only screen and (max-width: $breakpointXS){}

/* Small devices (large phones, between $breakpointXS and $breakpointMD) */
@media only screen and (min-width: $breakpointXS) and (max-width: $breakpointMD) {}

/* Medium devices (portrait tablets and large phones, between $breakpointMD and $breakpointLG) */
@media only screen and (min-width: $breakpointMD) and (max-width: $breakpointLG) {}

/* Large devices (landscape tablets, between $breakpointLG and $breakpointXL) */
@media only screen and (min-width: $breakpointLG) and (max-width: $breakpointXL) {}

/* Extra large devices (laptops/desktops, between $breakpointXL and up) */
@media only screen and (min-width: $breakpointXL) {}
```