import { IApp, IData, IDayForecast, IArrayData } from './@types/app';
import './style.scss';
const apiKey = import.meta.env.VITE_API_KEY;

const app: IApp = {
  months: [
    'Janv',
    'Févr',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juil',
    'Aout',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ],
  counterRefresh: 0,
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
  forecastHoursDiv: document.getElementById('forecastHours')! as HTMLDivElement,
  forecastDaysDiv: document.getElementById('forecastDays')! as HTMLDivElement,
  cityForm: document.getElementById('city-form')! as HTMLFormElement,
  cityInput: document.getElementById('city')! as HTMLInputElement,
  notificationsDiv: document.getElementById('notifications')! as HTMLDivElement,
  init: async () => {
    console.log("Initialisation de l'application en cours...");
    app.cityForm.addEventListener('submit', app.handleFormSubmit);
    app.refreshApp();
    console.log('Application initialisée.');
    app.notify('Bienvenue, veuillez choisir votre ville');
  },
  refreshApp: async () => {
    console.log('Réception du formulaire...');
    const actualCityLoc = await app.getLocation();
    if (
      (actualCityLoc.lat === 0 && actualCityLoc.lon === 0) ||
      actualCityLoc.lat === undefined ||
      actualCityLoc.lon === undefined
    ) {
      app.notify("Aucune ville n'a été trouvée à ce nom... 😢", 5, 'error');
    } else {
      // Météo actuelle
      const actualWheather = await app.getWeather(actualCityLoc);
      app.showWeatherInDom(actualWheather);

      // Pérvisions météo
      const foreCastWeather = await app.getForecast(actualCityLoc);
      app.showForecastHoursInDom(foreCastWeather);
      app.showForecastDaysInDom(foreCastWeather);

      // Reset de l'input
      app.cityInput.value = '';

      // Affichage d'une notification seulement lors d'un submit utilisateur
      app.counterRefresh > 0 &&
        app.notify(`Voici la météo pour ${app.actualCity} 😄`, 5, 'nice');
      app.counterRefresh++;
    }
  },
  getLocation: async () => {
    console.log(
      `Récupération des coordonnées en cours pour la ville de ${app.actualCity}...`
    );
    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${app.actualCity.toLowerCase()},fr&limit=2&appid=${apiKey}`
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
  getWeather: async (actualCityLoc) => {
    const { lat, lon } = actualCityLoc;
    console.log(
      `Recherche de la météo pour la lattitude : ${lat} et longitude : ${lon}`
    );
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=fr&units=metric&appid=${apiKey}`
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
  getForecast: async (actualCityLoc) => {
    const { lat, lon } = actualCityLoc;
    console.log(
      `Recherche des prévisions météo pour la lattitude : ${lat} et longitude : ${lon}`
    );
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=fr&units=metric&appid=${apiKey}`
      );
      if (response.status !== 200) throw new Error('Problème API');
      const json = await response.json();
      console.log('Données réceptionnées');
      // console.log(json);
      return json.list;
    } catch (error) {
      console.error(error);
      return;
    }
  },
  showWeatherInDom: (data) => {
    console.log('Affichage des données en cours...');
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
    // Actualisation du background
    if (data.weather[0].id.toString()[0] === '7') {
      document.body.style.background = `url('../img/Fog.jpg') no-repeat center/cover fixed`;
    } else {
      document.body.style.background = `url('../img/${data.weather[0].main}.jpg') no-repeat center/cover fixed`;
    }

    console.log('Données actualisées dans le DOM.');
  },
  showForecastHoursInDom: (data) => {
    console.log('Affichage des prévisions des 9 prochaines heures en cours...');
    app.forecastHoursDiv.textContent = '';
    for (let i = 0; i < 3; i++) {
      const oneForecast = data[i];
      const divContainer = document.createElement('div');
      divContainer.className = 'card';
      const divHours = document.createElement('div');
      divHours.className = 'date';
      const thisDate = new Date(oneForecast.dt * 1000);
      divHours.textContent = `${thisDate.getDate()}-${
        app.months[thisDate.getMonth()]
      } ${thisDate.getHours()}h`;
      const divWeather = document.createElement('div');
      divWeather.className = 'card__weather';
      const icon = document.createElement('img');
      icon.src = `https://openweathermap.org/img/wn/${oneForecast.weather[0].icon}.png`;
      icon.alt = oneForecast.weather[0].main;
      const divTemp = document.createElement('div');
      divTemp.textContent = `${oneForecast.main.temp.toFixed(1)}°C`;
      divWeather.append(icon, divTemp);
      divContainer.append(divHours, divWeather);
      app.forecastHoursDiv.appendChild(divContainer);
    }
  },
  // TODO: Afficher prévisions matin et aprem par jour
  showForecastDaysInDom: (data) => {
    console.log('Affichage des prévisions des 9 prochaines heures en cours...');
    app.forecastDaysDiv.textContent = '';
    for (let i = 1; i < 6; i++) {
      const oneDayForecast = app.getForecastPerDay(i, data);

      // Container
      const divContainer = document.createElement('div');
      divContainer.className = 'card';
      const divDate = document.createElement('div');
      divDate.className = 'date';
      divDate.textContent = oneDayForecast.date;

      // Bloc matin
      const divMorning = document.createElement('div');
      const divTitleMorning = document.createElement('div');
      divTitleMorning.textContent = 'Matin';
      const divWeatherMorning = document.createElement('div');
      divWeatherMorning.className = 'card__weather';
      const iconMorning = document.createElement('img');
      iconMorning.src = oneDayForecast.am.weatherIcon;
      iconMorning.alt = oneDayForecast.am.altIcon;
      const divTempMorning = document.createElement('div');
      divTempMorning.textContent = oneDayForecast.am.temp;
      divWeatherMorning.append(iconMorning, divTempMorning);
      divMorning.append(divTitleMorning, divWeatherMorning);

      // Bloc après-midi
      const divAfternoon = document.createElement('div');
      const divTitleAfternoon = document.createElement('div');
      divTitleAfternoon.textContent = 'Après-midi';
      const divWeatherAfternoon = document.createElement('div');
      divWeatherAfternoon.className = 'card__weather';
      const iconAfternoon = document.createElement('img');
      iconAfternoon.src = oneDayForecast.pm.weatherIcon;
      iconAfternoon.alt = oneDayForecast.pm.altIcon;
      const divTempAfternoon = document.createElement('div');
      divTempAfternoon.textContent = oneDayForecast.pm.temp;
      divWeatherAfternoon.append(iconAfternoon, divTempAfternoon);
      divAfternoon.append(divTitleAfternoon, divWeatherAfternoon);
      divContainer.append(divDate, divMorning, divAfternoon);
      app.forecastDaysDiv.appendChild(divContainer);
    }
  },
  getForecastPerDay: (day, data) => {
    console.log(`Récupération des prévisions pour J+${day}`);
    // On détermine la bonne date à J+1
    const today = new Date();
    const wantedDay = new Date();
    wantedDay.setDate(today.getDate() + day);
    // On récupère les prévisions qui concerne la bonne date entre 09h et 12h
    const morgningForecast = data.find((date: IData) => {
      const thisDate = new Date(date.dt * 1000);
      return (
        thisDate.getDate() === wantedDay.getDate() &&
        thisDate.getHours() > 7 &&
        thisDate.getHours() < 12
      );
    });
    // On récupère les prévisions qui concerne la bonne date entre 13h et 19h
    const afternoonForecast = data.find((date: IData) => {
      const thisDate = new Date(date.dt * 1000);
      return (
        thisDate.getDate() === wantedDay.getDate() &&
        thisDate.getHours() > 13 &&
        thisDate.getHours() < 17
      );
    });
    // On construit l'objet de réponse et on le return
    return {
      date: `${wantedDay.getDate()}-${app.months[wantedDay.getMonth()]}`,
      am: {
        weatherIcon: `https://openweathermap.org/img/wn/${morgningForecast.weather[0].icon}.png`,
        altIcon: morgningForecast.weather[0].main,
        temp: `${morgningForecast.main.temp.toFixed(1)}°C`,
      },
      pm: {
        weatherIcon: `https://openweathermap.org/img/wn/${afternoonForecast.weather[0].icon}.png`,
        altIcon: afternoonForecast.weather[0].main,
        temp: `${afternoonForecast.main.temp.toFixed(1)}°C`,
      },
    } as IDayForecast;
  },
  //TODO: pb avec encoreuricomponent impossible de saisir des noms composé comme villers-sur-mer
  handleFormSubmit: (e) => {
    e.preventDefault();
    console.log('Soumission du formulaire. Récupération des données...');
    const data = new FormData(app.cityForm);
    const newCity: any = data.get('city')?.toString()!;
    const newCityConverted: any = encodeURIComponent(newCity);
    console.log(newCityConverted);
    if (isNaN(newCityConverted)) {
      app.actualCity = newCityConverted;
      app.refreshApp();
    } else {
      app.notify(
        'Vous avez saisit un nombre ! Veuillez saisir une ville française 😄',
        5,
        'error'
      );
    }
  },
  notify: (message, timout = 3, theme = 'neutral') => {
    app.notificationsDiv.className = theme;
    app.notificationsDiv.textContent = message;
    setTimeout(() => {
      app.notificationsDiv.className = '';
    }, timout * 1000);
  },
};

document.addEventListener('DOMContentLoaded', app.init);
