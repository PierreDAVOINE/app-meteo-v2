interface CityProps {
  lat: number;
  lon: number;
}

export interface IApp {
  apiKey: string;
  actualCity: string;
  actualCityTitle: HTMLTitleElement | null;
  actualWeatherTxt: HTMLSpanElement | null;
  actualWeatherImg: HTMLElement | null;
  actualTempTxt: HTMLSpanElement | null;
  actualFeelTxt: HTMLSpanElement | null;
  actualWindTxt: HTMLSpanElement | null;
  actualHumidityTxt: HTMLSpanElement | null;
  actualSunTxt: HTMLSpanElement | null;
  actualSunImg: HTMLElement | null;
  init: () => void;
  handleForm: () => void;
  getLocation: () => Promise;
  getWeather: (CityProps) => {};
  showWeatherInDOm: ({}) => voi;
}
