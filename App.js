import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

import EventListComponent from "./components/EventListComponent";

export default function App() {
  return (
    <View style={styles.container}>
      <EventListComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
