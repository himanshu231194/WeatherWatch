import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";
import { getGeocodingData, getWeatherData } from "./src/api/api"; // Make sure this function is correctly implemented
import getWeatherImage from "./src/helpers/getWeatherImage";
import {
  CurrentWeather,
  LocationSuggestion,
  WeeklyForecastItem,
} from "./src/constants/constants";
import DropDownDisplay from "./src/components/DropDown/DropDown";

const App: React.FC = () => {
  const [location, setLocation] = useState<string>("New York");
  const [weatherData, setWeatherData] = useState<CurrentWeather | null>(null);
  const [weeklyForecast, setWeeklyForecast] = useState<WeeklyForecastItem[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [fetchingDataFailed, setFetchingDataFailed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    fetchGeoLocation(location);
  }, [location]);

  const fetchGeoLocation = async (locationName: string) => {
    try {
      const response: LocationSuggestion[] = await getGeocodingData(
        locationName
      );
      if (response.length === 0) {
        throw new Error("No location found. Please try another.");
      }
      fetchWeather(response[0].latitude, response[0].longitude);
    } catch (error) {
      setFetchingDataFailed(true);
      console.log("Error fetching location data:", error);
    }
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const weather = await getWeatherData(lat, lon);
      setWeatherData(weather.current);
      setWeeklyForecast(weather.weekly);
      setFetchingDataFailed(false);
    } catch (error) {
      setFetchingDataFailed(true);
      console.log("Error fetching weather data:", error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const suggestions = await getGeocodingData(query);
        if (suggestions.length === 0) {
          throw new Error("No suggestions found for this location.");
        }
        setLocationSuggestions(suggestions);
        setIsDropdownVisible(true);
      } catch (error) {
        setLocationSuggestions([]);
        setIsDropdownVisible(false);
        setFetchingDataFailed(true);
        console.log("Error fetching location suggestions:", error);
      }
    } else {
      setLocationSuggestions([]);
      setIsDropdownVisible(false);
    }
  };

  const handleLocationSelect = (selectedLocation: LocationSuggestion) => {
    setLocation(selectedLocation.name);
    setSearchQuery(selectedLocation.name);
    setIsDropdownVisible(false);
    fetchWeather(selectedLocation.latitude, selectedLocation.longitude);
  };

  if (!weatherData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>

      <TextInput
        style={styles.input}
        placeholder="Search location"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {isDropdownVisible && locationSuggestions.length > 0 && (
        <DropDownDisplay
          locationSuggestions={locationSuggestions}
          handleLocationSelect={(item) => handleLocationSelect(item)}
        />
      )}

      {fetchingDataFailed ? (
        <View style={{ justifyContent: "center" }}>
          <Text style={{ alignSelf: "center", color: "red" }}>
            {"Error fetching data"}
          </Text>
        </View>
      ) : (
        <View>
          <View style={styles.weatherContainer}>
            <Text style={styles.locationText}>{location}</Text>
            <Text style={styles.tempText}>{weatherData.temperature}°C</Text>
            <Image
              source={{ uri: getWeatherImage(weatherData.weathercode) }}
              style={styles.weatherImageTop}
            />
          </View>

          <FlatList
            data={weeklyForecast}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.forecastItem}>
                <Text style={{ alignSelf: "center" }}>{item.day}</Text>
                <Text style={{ alignSelf: "center" }}>
                  {item.temperature}°C
                </Text>
                <Image
                  source={{ uri: getWeatherImage(item.weatherCode) }}
                  style={styles.weatherImage}
                />
              </View>
            )}
          />

          <Text style={styles.avgTempText}>
            Average Temp:{" "}
            {Math.round(
              weeklyForecast.reduce((sum, day) => sum + day.temperature, 0) /
                weeklyForecast.length
            )}
            °C
          </Text>
        </View>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  input: { borderBottomWidth: 1, marginBottom: 10 },
  weatherContainer: { alignItems: "center", marginBottom: 20 },
  locationText: { fontSize: 20 },
  tempText: { fontSize: 50 },
  weatherImage: { width: 50, height: 50, alignSelf: "center" },
  weatherImageTop: { width: 100, height: 100, alignSelf: "center" },

  forecastItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  avgTempText: { textAlign: "center", marginTop: 20, fontSize: 18 },
  dropdownContainer: {
    position: "absolute",
    top: 100, // Adjust based on your input height
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    zIndex: 2, // Ensure this is higher than other elements
    maxHeight: 200, // Set a fixed height for the dropdown
    elevation: 3, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  suggestionItem: {
    padding: 10,
  },
  suggestionText: {
    fontSize: 16,
    color: "red",
  },
});
