export type GeocodingResult = {
  name: string;
  latitude: number;
  longitude: number;
  admin1: string;
  country: string;
};

export type CurrentWeather = {
  temperature: number;
  weathercode: WeatherCode;
};

export type DailyWeather = {
  temperature_2m_max: number[];
  weathercode: number[];
};

export type WeatherResponse = {
  current_weather: {
    temperature: number;
    weathercode: number;
  };
  daily: DailyWeather;
};

export type LocationSuggestion = {
  name: string;
  latitude: number;
  longitude: number;
  admin1: string;
  country: string;
};

export type WeeklyForecastItem = {
  day: string;
  temperature: number;
  weatherCode: WeatherCode;
};

export type WeatherImage = Record<
  "day" | "night",
  {
    description: string;
    image: string;
  }
>;

export type WeatherCode =
  | "0"
  | "1"
  | "2"
  | "3"
  | "45"
  | "48"
  | "51"
  | "53"
  | "55"
  | "56"
  | "57"
  | "61"
  | "63"
  | "65"
  | "66"
  | "67"
  | "71"
  | "73"
  | "75"
  | "77"
  | "80"
  | "81"
  | "82"
  | "85"
  | "86"
  | "95"
  | "96"
  | "99";
