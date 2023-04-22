import { IApp, CityProps, IData } from './@types/app';
import './style.scss';

const app: IApp = {
  apiKey: '9843a344764c7816f2325b732271f5e4',
  actualCity: 'Paris',
  actualCityTitle: document.querySelector('#now h2')!,
  actualWeatherTxt: document.getElementById('actual-weather_txt')!,
  actualWeatherImg: document.getElementById(
    'actual-weather_img'
  )! as HTMLImageElement,
  actualTempTxt: document.getElementById('actual-temp_txt')!,
  actualFeelTxt: document.getElementById('actual-feel_txt')!,
  actualWindTxt: document.getElementById('actual-wind_txt')!,
  actualHumidityTxt: document.getElementById('actual-humidity_txt')!,
  actualSunTxt: document.getElementById('actual-sun_txt')!,
  actualSunImg: document.getElementById('actual-sun_img')!,
  cityForm: document.getElementById('city-form')! as HTMLFormElement,
  // cityInput: document.getElementById('city')!,
  init: async () => {
    console.log("Initialisation de l'application en cours...");
    app.cityForm.addEventListener('submit', app.handleFormSubmit);
    app.refreshApp();
    console.log('Application initialisée.');
  },
  refreshApp: async () => {
    console.log('Réception du formulaire...');
    const actualCityLoc = await app.getLocation();
    const actualWheather = await app.getWeather(actualCityLoc);
    app.showWeatherInDOm(actualWheather);
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
  showWeatherInDOm: (data: IData) => {
    console.log('Affichage des données en cours...');
    console.log(data);
    app.actualCityTitle.textContent = `Actuellement à ${app.actualCity}`;
    const weatherDescription = data.weather[0].description;
    app.actualWeatherTxt.textContent =
      weatherDescription[0].toUpperCase() + weatherDescription.slice(1);
    app.actualWeatherImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    app.actualTempTxt.textContent = `${data.main.temp.toFixed(1)}°C`;
    app.actualFeelTxt.textContent = `Ressenti : ${data.main.feels_like.toFixed(
      1
    )}°C`;
    app.actualWindTxt.textContent = `${(data.wind.speed * 3.6).toFixed(
      2
    )} km/h`;
    app.actualHumidityTxt.textContent = `${Math.round(
      data.main.humidity
    )}% d'humitité`;
    // Convertion des timestamp sunrise et sunset en heures minutes au format HH:MM
    const sunrise =
      '0' +
      new Date(data.sys.sunrise * 1000).getHours() +
      'h' +
      new Date(data.sys.sunrise * 1000).getMinutes();
    const sunset =
      new Date(data.sys.sunset * 1000).getHours() +
      'h' +
      new Date(data.sys.sunset * 1000).getMinutes();
    app.actualSunTxt.textContent = `Levé à ${sunrise} couché à ${sunset}`;
    // actualSunImg: ;

    console.log('Données actualisées dans le DOM.');
  },
  //TODO: Gérer les erreurs de saisie !
  handleFormSubmit: async (e) => {
    e.preventDefault();
    console.log('Soumission du formulaire. Récupération des données...');
    const data = new FormData(app.cityForm);
    app.actualCity = data.get('city')?.toString()!;
    app.refreshApp();
  },
};

document.addEventListener('DOMContentLoaded', app.init);
