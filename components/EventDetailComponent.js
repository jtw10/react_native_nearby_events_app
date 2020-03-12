import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  Button,
  Linking
} from "react-native";
import PropTypes from "prop-types";

import HeaderComponent from "./HeaderComponent";

export default class EventDetailComponent extends React.Component {
  state = {};

  render() {
    const { navigation } = this.props;
    const eventUrl = navigation.getParam("eventUrl", "www.ticketmaster.com");
    const imageUrl = navigation.getParam(
      "imageUrl",
      "https://1m19tt3pztls474q6z46fnk9-wpengine.netdna-ssl.com/wp-content/themes/unbound/images/No-Image-Found-400x264.png"
    );

    return (
      <View style={styles.container}>
        <Image style={styles.item_image} source={{ uri: imageUrl }} />
        <Text
          style={{ color: "blue" }}
          onPress={() => Linking.openURL(eventUrl)}
        >
          Buy Tickets
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listContainer: {
    flex: 1
  },
  paragraph: {
    margin: 6,
    fontSize: 18,
    textAlign: "center"
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
    marginTop: 10,
    marginBottom: 0,
    marginHorizontal: 16
  },
  bottom_margin: {
    marginTop: 10,
    padding: 6
  },
  title: {
    fontSize: 32
  },
  searchbar: {
    height: 60,
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 16
  },
  searchbar_range: {
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: -20
  }
});
