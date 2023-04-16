import './style.scss';

interface CityProps {
  lon: number;
  lat: number;
}

const app = {
  apiKey: '9843a344764c7816f2325b732271f5e4',
  // Formulaire
  cityForm: document.getElementById('cityForm'),
  // input de la ville
  cityInput: document.querySelector('#city'),
  // btn de validation
  btnGet: document.querySelector('.select-city'),
  // menu déroulant pour doublons
  citySelect: document.querySelector('#select-the-good-city'),
  values: document.querySelectorAll('.value'),
  // div.city pour afficher le nom de la ville séléctionné
  cityShow: document.querySelector('.city'),
  // div#imgWeather pour afficher l'icone de la météo dynamiquement
  weatherImg: document.querySelector('#imgWeather'),
  // div.temp-value pour afficher la temperature
  tempShow: document.querySelector('.temp-value'),
  // div.wet-value pour afficher l'humidité
  wetShow: document.querySelector('.wet-value'),
  // div.wind-value pour afficher la vitesse du vent
  windShow: document.querySelector('.wind-value'),
  init: async () => {
    console.log("Initialisation de l'application en cours...");
    // Mise sur écoute des éléments du DOM
    const actualCity = await app.getLocation();
    const actualWheather = await app.getWeather(actualCity);
    app.showWeatherInDOm(actualWheather);
    console.log('Application initialisée.');
  },
  handleForm: () => {
    console.log('Réception du formulaire...');
  },
  getLocation: async (city = 'Paris') => {
    console.log(
      `Récupération des coordonnées en cours pour la ville de ${city}...`
    );
    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city.toLowerCase()},fr&limit=2&appid=${
          app.apiKey
        }`
      );
      if (response.status !== 200) throw new Error('Problème API');
      const json = await response.json();
      const actualCity = {
        lat: '',
        lon: '',
      };
      if (json.length > 1) {
        actualCity.lat = json[0].lat;
        actualCity.lon = json[0].lon;
        return actualCity;
      } else if (json.length === 1) {
        actualCity.lat = json[0].lat;
        actualCity.lon = json[0].lon;
        return actualCity;
      } else {
        // TODOS: créer un systeme de notification
        console.log('Ville non trouvée...');
      }
    } catch (error: string) {
      console.error(error.message);
    }
  },
  getWeather: async (actualCity: CityProps) => {
    const { lat, lon } = actualCity;
    console.log(
      `Recherche de la météo pour la lattitude : ${lat} et longitude : ${lon}`
    );
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${app.apiKey}`
      );
      if (response.status !== 200) throw new Error('Problème API');
      const json = await response.json();
      console.log('Données réceptionnées');
      return json;
    } catch (error) {
      console.error(error.message);
    }
  },
  showWeatherInDOm: (data: {}) => {
    console.log('Affichage des données en cours...');
    console.log(data);

    console.log('Données actualisées dans le DOM.');
  },
};

document.addEventListener('DOMContentLoaded', app.init);
