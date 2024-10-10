import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import DropDownDisplay from "../DropDown"; // Adjust the path as necessary
import { LocationSuggestion } from "../../../constants/constants";

// Mock data for testing
const mockSuggestions: LocationSuggestion[] = [
  { name: "New York", admin1: "NY", country: "USA", latitude: 40.7128, longitude: -74.0060 },
  { name: "Los Angeles", admin1: "CA", country: "USA", latitude: 34.0522, longitude: -118.2437 },
  { name: "Chicago", admin1: "IL", country: "USA", latitude: 41.8781, longitude: -87.6298 },
];

describe("DropDownDisplay", () => {
  it("renders correctly with provided location suggestions", () => {
    const { getByText } = render(
      <DropDownDisplay 
        locationSuggestions={mockSuggestions} 
        handleLocationSelect={() => {}} 
      />
    );

    // Check if all suggestions are rendered
    mockSuggestions.forEach((suggestion) => {
      expect(getByText(`${suggestion.name}, ${suggestion.admin1}, ${suggestion.country}`)).toBeTruthy();
    });
  });

  it("calls handleLocationSelect with the correct argument when a suggestion is pressed", () => {
    const handleLocationSelectMock = jest.fn(); // Create a mock function
    const { getByText } = render(
      <DropDownDisplay 
        locationSuggestions={mockSuggestions} 
        handleLocationSelect={handleLocationSelectMock} 
      />
    );

    // Simulate pressing the first suggestion
    fireEvent.press(getByText(`${mockSuggestions[0].name}, ${mockSuggestions[0].admin1}, ${mockSuggestions[0].country}`));

    // Assert that the mock function was called with the correct argument
    expect(handleLocationSelectMock).toHaveBeenCalledWith(mockSuggestions[0]);
  });
});
