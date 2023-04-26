# app-meteo-v2

Mise a jour de ma première app meteo que j'avais réalisée avant ma formation chez O'clock.

> Update of my first weather app relised before my training from O'Clock school.

Mon objectif ici était de la refaire avec un code plus propre et en typescript tout en profitant de l'occasion pour ajouter quelques features comme l'affichage les prévisions des prochaines heures et prochains jours.

> My goal here was to remake this app properly with typescript and trying to add some features like some  forecast.

---

## Stack

Projet développé avec ViteJS en TypeScript Vanilla.
L'API météo utilisée est [OpenWeatherMap](https://openweathermap.org/)

> This project was made with ViteJS in Vanilla TypeScript
> The weather API used here is [OpenWeatherMap](https://openweathermap.org/)

---

## Project Setup

### Install

```sh
npm install
```

ou

```sh
yarn
```

### ApiKey

Pour que l'appel à l'API fonctionne, vous devez utilisez une variable d'environnement dans un fichier `.env` à la racine du projet

> You need to install environnement variable file `.env` at the root of the project.

```dotenv
VITE_API_KEY: yourkey
```

Pour avoir votre propre clé API vous devez vous créer un compte sur le site de [OpenWeatherMap](https://openweathermap.org/)
> To get you API key, you need to create an account to the website : [OpenWeatherMap](https://openweathermap.org/)

### Compile and Hot-Reload for Development

```sh
npm run dev
```

ou

```sh
yarn dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

ou

```sh
yarn build
```
