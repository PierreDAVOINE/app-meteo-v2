interface CityProps {
  lat: number;
  lon: number;
}

export interface IApp {
  apiKey: string;
  actualCity: string;
  actualCityTitle: HTMLTitleElement;
  actualWeatherTxt: HTMLSpanElement;
  actualWeatherImg: HTMLImageElement;
  actualTempTxt: HTMLSpanElement;
  actualFeelTxt: HTMLSpanElement;
  actualWindTxt: HTMLSpanElement;
  actualHumidityTxt: HTMLSpanElement;
  actualSunTxt: HTMLSpanElement;
  actualSunImg: HTMLElement;
  sunrise: number;
  sunset: number;
  init: () => void;
  handleForm: () => void;
  getLocation: () => Promise;
  getWeather: (CityProps) => {};
  showWeatherInDOm: (IData) => void;
}
export interface IData {
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
}
