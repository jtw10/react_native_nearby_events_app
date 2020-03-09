import React, { Component } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import PropTypes from "prop-types";

export default class HeaderComponent extends Component {
  render() {
    return (
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../assets/ticketmaster.png")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 0,
    marginTop: 10
  },
  header: {
    height: 100,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#1F262D"
  }
});
