import React, { Component } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import EventListComponent from "./components/EventListComponent";
import HeaderComponent from "./components/HeaderComponent";

export default function App() {
  return (
    <View style={styles.container}>
      <HeaderComponent />
      <EventListComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF4FD"
  }
});
