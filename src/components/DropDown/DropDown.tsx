import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { LocationSuggestion } from "../../constants/constants";

type DropDownDisplayProps = {
  locationSuggestions: LocationSuggestion[];
  handleLocationSelect: (selectedLocation: LocationSuggestion) => void;
};

const DropDownDisplay: React.FC<DropDownDisplayProps> = ({
  locationSuggestions,
  handleLocationSelect,
}) => {
  const renderSuggestionItem = ({ item }: { item: LocationSuggestion }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleLocationSelect(item)}
    >
      <Text style={styles.suggestionText}>
        {item.name}, {item.admin1}, {item.country}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.dropdownContainer}>
      <FlatList
        data={locationSuggestions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderSuggestionItem}
        style={{ height: 500, width: "100%" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    zIndex: 2,
    maxHeight: 200,
    elevation: 3,
    shadowColor: "#000",
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

export default DropDownDisplay;
