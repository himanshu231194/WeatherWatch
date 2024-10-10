import axios from "axios";
import { getGeocodingData, getWeatherData } from "../api"; // Adjust the path as necessary
import { GeocodingResult, WeatherResponse } from "../../constants/constants"; // Ensure this path is correct
import {
  GEO_CODING_DATA_MOCK,
  WEATHER_DATA_MOCK,
} from "../../mock/common.mock";

jest.mock("axios"); // Mock axios

describe("API Functions", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  describe("getGeocodingData", () => {
    it("returns location suggestions when API call is successful", async () => {
      const mockResponse = {
        data: {
          results: GEO_CODING_DATA_MOCK as GeocodingResult[],
        },
      };

      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getGeocodingData("New York");

      expect(result).toEqual(GEO_CODING_DATA_MOCK);
    });

    it("returns an empty array when no locations are found", async () => {
      const mockResponse = {
        data: {
          results: [],
        },
      };

      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getGeocodingData("Unknown Location");

      expect(result).toEqual([]);
    });

    it("throws an error when API call fails", async () => {
      const errorMessage = "Network Error";
      (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(getGeocodingData("New York")).rejects.toThrow(errorMessage);
    });
  });

  describe("getWeatherData", () => {
    it("returns weather data when API call is successful", async () => {
      const mockResponse = {
        data: {
          current_weather: {
            temperature: 25,
            weathercode: 1,
          },
          daily: {
            temperature_2m_max: [30, 32, 28],
            weathercode: [1, 2, 3],
          },
        } as WeatherResponse,
      };

      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getWeatherData(40.7128, -74.006);

      expect(result).toEqual(WEATHER_DATA_MOCK);
    });

    it("throws an error when API call fails", async () => {
      const errorMessage = "Network Error";
      (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(getWeatherData(40.7128, -74.006)).rejects.toThrow(
        errorMessage
      );
    });
  });
});
