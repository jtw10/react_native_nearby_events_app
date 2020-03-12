import React from "react";
import { Text, View, StyleSheet, Image, Linking } from "react-native";

import HeaderComponent from "./HeaderComponent";

export default class EventDetailComponent extends React.Component {
  state = {};

  render() {
    const { navigation } = this.props;
    const eventName = navigation.getParam("eventName", "No Event Name Found");
    const eventUrl = navigation.getParam("eventUrl", "www.ticketmaster.com");
    const eventDistance = navigation.getParam(
      "eventDistance",
      "Distance information unavailable"
    );
    const eventDate = navigation.getParam(
      "eventDate",
      "Date information unavailable"
    );
    const eventTime = navigation.getParam(
      "eventTime",
      "Time information unavailable"
    );
    const eventStatus = navigation.getParam(
      "eventStatus",
      "Status information unvailable"
    );
    const eventInfo = navigation.getParam(
      "eventInfo",
      "Event information unavailable"
    );
    const eventMinPrice = navigation.getParam(
      "eventMinPrice",
      "Price information unavailable"
    );
    const eventMaxPrice = navigation.getParam(
      "eventMaxPrice",
      "Price information unavailable"
    );
    const imageUrl = navigation.getParam(
      "imageUrl",
      "https://1m19tt3pztls474q6z46fnk9-wpengine.netdna-ssl.com/wp-content/themes/unbound/images/No-Image-Found-400x264.png"
    );

    return (
      <View style={styles.container}>
        <HeaderComponent />

        <Text style={styles.title}>{eventName}</Text>
        <Image
          style={styles.item_image}
          source={{ uri: imageUrl }}
          resizeMode="cover"
        />
        <View style={styles.item_text}>
          <Text>Date: {eventDate}</Text>
          <Text>Time: {eventTime}</Text>
          <Text>Status: {eventStatus}</Text>
          <Text>Info: {eventInfo}</Text>
          <Text
            style={{ color: "blue" }}
            onPress={() => Linking.openURL(eventUrl)}
          >
            Buy Tickets
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item_text: {
    backgroundColor: "#E3E4E5",
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 0,
    marginBottom: 0,
    marginHorizontal: 16,
    color: "#013670"
  },
  item_image: {
    padding: 80,
    marginBottom: 0,
    marginHorizontal: 16,
    height: 300
  },
  bottom_margin: {
    marginTop: 10,
    padding: 6
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    backgroundColor: "#E3E4E5",
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 5,
    marginTop: 0,
    marginBottom: 0,
    marginHorizontal: 16,
    marginTop: 10,
    color: "#013670"
  }
});
