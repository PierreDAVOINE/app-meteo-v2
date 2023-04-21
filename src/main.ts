import { IApp, CityProps } from './@types/app';
import './style.scss';

const app: IApp = {
  apiKey: '9843a344764c7816f2325b732271f5e4',
  actualCity: 'Paris',
  actualCityTitle: document.querySelector('#now h2'),
  actualWeatherTxt: document.getElementById('actual-weather_txt'),
  actualWeatherImg: document.getElementById('actual-weather_img'),
  actualTempTxt: document.getElementById('actual-temp_txt'),
  actualFeelTxt: document.getElementById('actual-feel_txt'),
  actualWindTxt: document.getElementById('actual-wind_txt'),
  actualHumidityTxt: document.getElementById('actual-humidity_txt'),
  actualSunTxt: document.getElementById('actual-sun_txt'),
  actualSunImg: document.getElementById('actual-sun_img'),
  init: async () => {
    console.log("Initialisation de l'application en cours...");
    const actualCityLoc = await app.getLocation();
    const actualWheather = await app.getWeather(actualCityLoc);
    app.showWeatherInDOm(actualWheather);
    console.log('Application initialisée.');
  },
  handleForm: () => {
    console.log('Réception du formulaire...');
  },
  getLocation: async () => {
    console.log(
      `Récupération des coordonnées en cours pour la ville de ${app.actualCity}...`
    );
    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${app.actualCity.toLowerCase()},fr&limit=2&appid=${
          app.apiKey
        }`
      );
      if (response.status !== 200) throw new Error('Problème API');
      const json = await response.json();
      const actualCity = {
        lat: 0,
        lon: 0,
      };
      if (json.length > 1) {
        actualCity.lat = json[0].lat;
        actualCity.lon = json[0].lon;
        return actualCity;
      } else if (json.length === 1) {
        actualCity.lat = json.lat;
        actualCity.lon = json.lon;
        return actualCity;
      } else {
        console.log('Ville non trouvée...');
        return actualCity;
      }
    } catch (error: unknown) {
      console.error(error);
      return;
    }
  },
  getWeather: async (actualCityLoc: CityProps) => {
    const { lat, lon } = actualCityLoc;
    console.log(
      `Recherche de la météo pour la lattitude : ${lat} et longitude : ${lon}`
    );
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=fr&units=metric&appid=${app.apiKey}`
      );
      if (response.status !== 200) throw new Error('Problème API');
      const json = await response.json();
      console.log(json);
      console.log('Données réceptionnées');
      return json;
    } catch (error) {
      console.error(error);
      return;
    }
  },
  showWeatherInDOm: (data: {}) => {
    console.log('Affichage des données en cours...');
    console.log(data);
    app.actualCityTitle.textContent = `Actuellement à ${
      app.actualCity ? app.actualCity : ''
    } :`;
    app.actualWeatherTxt.textContent = data.weather[0].description;
    app.actualWeatherImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    app.actualTempTxt.textContent = `${data.main.temp}°C`;
    app.actualFeelTxt.textContent = `Ressenti : ${data.main.feels_like}°C`;
    app.actualWindTxt.textContent = `${data.wind.speed} m/s`;
    app.actualHumidityTxt.textContent = `${data.main.humidity}% d'humitité`;
    app.actualSunTxt.textContent = `Se lève à 06h00 se couche à 20h00`;
    // actualSunImg: ;

    console.log('Données actualisées dans le DOM.');
  },
};

document.addEventListener('DOMContentLoaded', app.init);
