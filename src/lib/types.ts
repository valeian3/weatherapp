export interface ISearchLocation {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated: string;
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    feelslike_c: number;
    uv: number;
    air_quality?: {
      co: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      us_epa_index?: number;
      gb_defra_index?: number;
    };
  };
}

export interface ISearchSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}
interface IDay {
  maxtemp_c: number;
  mintemp_c: number;
  avgtemp_c: number;
  condition: {
    text: string;
    icon: string;
  };
  uv: number;
}

interface IForecastday {
  date: string;
  day: IDay;
}

interface IForecast {
  forecastday: IForecastday[];
}

interface ILocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

interface ICurrent {
  last_updated: string;
  temp_c: number;
  condition: {
    text: string;
    icon: string;
  };
  feelslike_c: number;
  uv: number;
  air_quality?: {
    co: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    us_epa_index?: number;
    gb_defra_index?: number;
  };
}

export interface ICurrentAndForecast {
  location: ILocation;
  current: ICurrent;
  forecast: IForecast;
}
