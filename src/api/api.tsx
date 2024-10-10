import axios from "axios";
import { CurrentWeather, GeocodingResult, LocationSuggestion, WeatherCode, WeatherResponse } from "../constants/constants";

export const getGeocodingData = async (
  locationName: string
): Promise<LocationSuggestion[]> => {
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${locationName}`;
  try {
    const response = await axios.get<{ results: GeocodingResult[] }>(
      geocodingUrl
    );
    const locations = response.data.results;
    if (!locations.length) {
      console.warn("No locations found for the given name.");
      return [];
    }
    console.log("Geocoding response:", locations);
    const suggestions: LocationSuggestion[] = locations.map(location => ({
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      admin1: location.admin1,
      country: location.country,
    }));

    return suggestions;
  } catch (error) {
    console.log("Error fetching geocoding data:", error);
    throw error;
  }
};

type WeatherData = {
  current: CurrentWeather;
  weekly: { day: string; temperature: number; weatherCode: WeatherCode }[];
};

export const getWeatherData = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,weathercode`;
  const response = await axios.get<WeatherResponse>(weatherUrl);
  const currentWeather: CurrentWeather = {
    temperature: response.data.current_weather.temperature,
    weathercode: mapWeatherCode(response.data.current_weather.weathercode), // Map the weather code
  };
  const weeklyWeather = response.data.daily.temperature_2m_max.map(
    (temperature: number, index: number) => ({
      day: `Day ${index + 1}`,
      temperature,
      weatherCode: mapWeatherCode(response.data.daily.weathercode[index]), // Map the weather code
    })
  );
  return { current: currentWeather, weekly: weeklyWeather };
};

const mapWeatherCode = (code: number): WeatherCode => {
  const weatherCodeMapping: Record<number, WeatherCode> = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    45: "45",
    48: "48",
    51: "51",
    53: "53",
    55: "55",
    56: "56",
    57: "57",
    61: "61",
    63: "63",
    65: "65",
    66: "66",
    67: "67",
    71: "71",
    73: "73",
    75: "75",
    77: "77",
    80: "80",
    81: "81",
    82: "82",
    85: "85",
    86: "86",
    95: "95",
    96: "96",
    99: "99",
  };

  return weatherCodeMapping[code] || "0";
};
