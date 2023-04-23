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
  cityForm: HTMLFormElement;
  cityInput: HTMLInputElement;
  notificationsDiv: HTMLDivElement;
  init: () => void;
  refreshApp: () => void;
  getLocation: () => Promise;
  getWeather: (CityProps) => {};
  showWeatherInDOm: (IData) => void;
  handleFormSubmit: (e: Event) => void;
  notify: (
    message: string,
    timing?: number,
    theme?: 'neutral' | 'error' | 'nice'
  ) => void;
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
