interface CityProps {
  lat: number;
  lon: number;
}

export interface IApp {
  months: string[];
  counterRefresh: number;
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
  forecastHoursDiv: HTMLDivElement;
  forecastDaysDiv: HTMLDivElement;
  cityForm: HTMLFormElement;
  cityInput: HTMLInputElement;
  notificationsDiv: HTMLDivElement;
  init: () => void;
  refreshApp: () => void;
  getLocation: () => Promise;
  getWeather: (actualCityLoc: CityProps) => Promise<IData>;
  getForecast: (actualCityLoc: CityProps) => Promise<IArrayData>;
  showWeatherInDom: (data: IData) => void;
  showForecastHoursInDom: (data: IArrayData) => void;
  showForecastDaysInDom: (data: IArrayData) => void;
  getForecastPerDay: (day: number, data: IArrayData) => IDayForecast;
  handleFormSubmit: (e: Event) => void;
  notify: (
    message: string,
    timing?: number,
    theme?: 'neutral' | 'error' | 'nice'
  ) => void;
}

export interface IArrayData {
  [i: number]: IData;
  find(arg0: (date: IData) => boolean): IData;
  array: IData[];
}

export interface IData {
  weather: [
    {
      id: number;
      main: string;
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
  dt: number;
  dt_txt?: string;
}

export interface IDayForecast {
  date: string;
  am: {
    weatherIcon: string;
    altIcon: string;
    temp: string;
  };
  pm: {
    weatherIcon: string;
    altIcon: string;
    temp: string;
  };
}
