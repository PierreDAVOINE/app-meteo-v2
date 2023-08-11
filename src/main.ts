import { IApp, IData, IDayForecast } from './@types/app'; // Import du typage
import './style.scss';
const apiKey = import.meta.env.VITE_API_KEY; // import de la clé API dans le fichier .env à la racine du projet

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
  // init() est la fonction d'initialisation. Elle pose l'écouteur d'événement sur le formulaire et affiche la météo de `app.actualCity`, initialisée sur Paris.
  init: async () => {
    console.log("Initialisation de l'application en cours...");
    app.cityForm.addEventListener('submit', app.handleFormSubmit);
    app.refreshApp();
    console.log('Application initialisée.');
    app.notify('Bienvenue, veuillez choisir votre ville');
  },
  // refreshApp() est la fonction mère qui exécture les foncitons nécessaire pour afficher la météo de la ville contenu dans app.actualCity
  refreshApp: async () => {
    console.log('Réception du formulaire...');
    // D'abord elle récupère la latitude et longitude de la ville souhaitée
    const actualCityLoc = await app.getLocation();
    if (
      (actualCityLoc.lat === 0 && actualCityLoc.lon === 0) ||
      actualCityLoc.lat === undefined ||
      actualCityLoc.lon === undefined
    ) {
      app.notify("Aucune ville n'a été trouvée à ce nom... 😢", 5, 'error');
    } else {
      // Ici, elle récupère la météo actuelle
      const actualWheather = await app.getWeather(actualCityLoc);
      // Et l'affiche dans le dom
      app.showWeatherInDom(actualWheather);

      // Ici, elle récupère les prévisions météos
      const foreCastWeather = await app.getForecast(actualCityLoc);
      // Affiche les prévisions des prochaines heures dans le DOM
      app.showForecastHoursInDom(foreCastWeather);
      // Affiche les prévisions des prochains jours dans le DOM
      app.showForecastDaysInDom(foreCastWeather);

      // Reset de l'input du formulaire
      app.cityInput.value = '';

      // Affichage d'une notification seulement lors d'un submit utilisateur et non au premier chargement de la page
      app.counterRefresh > 0 &&
        app.notify(`Voici la météo pour ${app.actualCity} 😄`, 5, 'nice');
      app.counterRefresh++;
    }
  },
  // getLocation() est la fonction qui permet de récupérer la longitude et latitude d'une ville grâce a l'URL API fournis par Openweathermap
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
      if (json.length === 0) {
        console.log('Ville non trouvée...');
        return actualCity;
      } else {
        app.actualCity = json[0].name;
        actualCity.lat = json[0].lat;
        actualCity.lon = json[0].lon;
        return actualCity;
      }
    } catch (error: unknown) {
      console.error(error);
      return;
    }
  },
  // getWeather() est la fonction qui permet de récupérer auprès de l'API la météo du jour grâce aux coordonées passées en paramètre.
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
      console.log('Données réceptionnées');
      return json;
    } catch (error) {
      console.error(error);
      return;
    }
  },
  // getForecast() est la fonction qui permet de récupèrer auprès de l'API les 40 prochaines prévisions météo par tranche de 3h grâce aux coordonées passées en paramètre.
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
  // showWeatherInDom() s'occupe de générer des éléments HTML et d'afficher les données de la météo actuelle (passée en paramètre) dans le DOM.
  showWeatherInDom: (data) => {
    console.log('Affichage des données en cours...');
    app.actualCityTitle.textContent = `Actuellement à ${app.actualCity}`;
    const weatherDescription = data.weather[0].description;
    app.actualWeatherTxt.textContent =
      weatherDescription[0].toUpperCase() + weatherDescription.slice(1); // Met le nom de la ville avec la première lettre en majuscule.
    app.actualWeatherImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    app.actualTempTxt.textContent = `${data.main.temp.toFixed(1)}°C`; // Arrondi la température à 1 chiffre après la virgule.
    app.actualFeelTxt.textContent = `Ressenti : ${data.main.feels_like.toFixed(
      1
    )}°C`;
    app.actualWindTxt.textContent = `${(data.wind.speed * 3.6).toFixed(
      2
    )} km/h`; // Converti la vitesse du vends de m/s en km/h
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
    // Actualisation du background en fonction de la météo
    if (data.weather[0].id.toString()[0] === '7') {
      // Les météos de code 7xx correspondent à la brume mais possède pleins de noms différents. J'ai trouvé plus pertinent d'afficher le même background pour tous les codes commencant par 7.
      document.body.style.background = `url('../img/Fog.jpg') no-repeat center/cover fixed`;
    } else {
      document.body.style.background = `url('../img/${data.weather[0].main}.jpg') no-repeat center/cover fixed`;
    }

    console.log('Données actualisées dans le DOM.');
  },
  // showForecastHoursInDom() reçoit les prévisions par tranche de 3h, récupère les 3 premières prévisions et les affiches dans le DOM.
  showForecastHoursInDom: (data) => {
    console.log('Affichage des prévisions des 9 prochaines heures en cours...');
    app.forecastHoursDiv.textContent = ''; // vide la div container.

    for (let i = 0; i < 3; i++) {
      // On récupère les trois premières prévision via l'index [i]
      const oneForecast = data[i];
      // Div englobante de class card
      const divContainer = document.createElement('div');
      divContainer.className = 'card';
      // Div pour la date
      const divHours = document.createElement('div');
      divHours.className = 'date';
      const thisDate = new Date(oneForecast.dt * 1000);
      divHours.textContent = `${thisDate.getDate()}-${
        app.months[thisDate.getMonth()]
      } ${thisDate.getHours()}h`;
      // Div pour la météo
      const divWeather = document.createElement('div');
      divWeather.className = 'card__weather';
      const icon = document.createElement('img');
      icon.src = `https://openweathermap.org/img/wn/${oneForecast.weather[0].icon}.png`;
      icon.alt = oneForecast.weather[0].main;
      const divTemp = document.createElement('div');
      divTemp.textContent = `${oneForecast.main.temp.toFixed(1)}°C`;
      divWeather.append(icon, divTemp);
      divContainer.append(divHours, divWeather);
      // Mise en DOM
      app.forecastHoursDiv.appendChild(divContainer);
    }
  },
  // showForecastDaysInDom() reçoit les prévisions par tranche de 3h et affiche les prévisions des 4 prochains jours au format matin / après-midi (voir détail dans la fonction)
  showForecastDaysInDom: (data) => {
    console.log('Affichage des prévisions des 9 prochaines heures en cours...');
    app.forecastDaysDiv.textContent = ''; // vide la div container.

    for (let i = 1; i < 5; i++) {
      // le i incrémenté sera le jour j+i passé en parramètre pour la fonction getForecastPerDay()
      const oneDayForecast = app.getForecastPerDay(i, data);

      // Div englobante
      const divContainer = document.createElement('div');
      divContainer.className = 'card';

      // Div date
      const divDate = document.createElement('div');
      divDate.className = 'date';
      divDate.textContent = oneDayForecast.date;

      // Div englobante pour la météo du matin
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

      // Div englobante pour la météo de l'après midi
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
  // getForecastPerDay() est une fonction générique qui permet dé récupérer les prévisions pour le jour 'aujourd'hui + day' dans le tableau de prévisions 'data'
  getForecastPerDay: (day, data) => {
    console.log(`Récupération des prévisions pour J+${day}`);
    // On détermine la bonne date à J+1 a partir de la date du jour
    const today = new Date();
    const wantedDay = new Date();
    wantedDay.setDate(today.getDate() + day);
    // On récupère les prévisions qui concerne wantedDay entre 09h et 12h
    const morgningForecast = data.find((date: IData) => {
      const thisDate = new Date(date.dt * 1000);
      return (
        thisDate.getDate() === wantedDay.getDate() &&
        thisDate.getHours() > 7 &&
        thisDate.getHours() < 12
      );
    });
    // On récupère les prévisions qui concerne wantedDay entre 13h et 19h
    const afternoonForecast = data.find((date: IData) => {
      const thisDate = new Date(date.dt * 1000);
      return (
        thisDate.getDate() === wantedDay.getDate() &&
        thisDate.getHours() > 13 &&
        thisDate.getHours() < 18
      );
    });
    // On return l'objet avec les infos dont on a besoin pour générer l'élement dans la fonction showForecastDaysInDom()
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
  // handleSubmitForm() gère le submit du formulaire
  handleFormSubmit: (e) => {
    e.preventDefault();
    console.log('Soumission du formulaire. Récupération des données...');
    const data = new FormData(app.cityForm);
    const newCity: any = data.get('city')?.toString()!; // Récupération de la valeur de l'input
    // On vérifie que la valeur saisie est bien une chaine de caractère
    // On vérifie également si la valeur saisie n'est pas juste un nombre
    if (isNaN(newCity) && newCity.match(/^[a-zA-ZÀ-ÿ\s'-]+$/)) {
      app.actualCity = newCity; // On affecte la nouvelle ville a notre variable app.actualCity()
      app.refreshApp(); // Et on lance le refresh des infos du DOM avec la météo de la nouvelle ville
    } else {
      app.notify(
        'Vous avez saisit des caractères incorrects ! Veuillez saisir une ville française 😄',
        5,
        'error'
      );
    }
  },
  // notify() est une fonction générique qui permet de générer une notification pour l'utilisateur notamment lorsque la ville saisie n'est pas reconnu.
  notify: (message, timout = 3, theme = 'neutral') => {
    app.notificationsDiv.className = theme;
    app.notificationsDiv.textContent = message;
    setTimeout(() => {
      app.notificationsDiv.className = '';
    }, timout * 1000);
  },
};

document.addEventListener('DOMContentLoaded', app.init);
