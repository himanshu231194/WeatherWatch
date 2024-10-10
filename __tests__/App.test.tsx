import React from "react";
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import App from "../App"; // Adjust the import path as necessary
import { getGeocodingData, getWeatherData } from "../src/api/api"; // Adjust the import path as necessary
import {
  GEO_CODING_DATA_MOCK,
  WEATHER_DATA_MOCK,
} from "../src/mock/common.mock";

// Mock the API functions
jest.mock("../src/api/api");

describe("App Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("renders loading text initially", () => {
    render(<App />);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("fetches weather data on location change", async () => {
    // Mock API responses
    (getGeocodingData as jest.Mock).mockResolvedValueOnce(GEO_CODING_DATA_MOCK);
    (getWeatherData as jest.Mock).mockResolvedValueOnce(WEATHER_DATA_MOCK);

    render(<App />);

    // Wait for loading to finish and check if weather data is displayed
    await waitFor(() => {
      expect(screen.getByText("Weather App")).toBeTruthy();
      expect(screen.getByText("25°C")).toBeTruthy(); // Check if the temperature is displayed
    });
  });
});
