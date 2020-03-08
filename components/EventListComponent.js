import React, { Component } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
  Button,
  TextInput,
  SafeAreaView
} from "react-native";
import PropTypes from "prop-types";
import geohash from "ngeohash";

import * as Permissions from "expo-permissions";

function Item({ title }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export default class EventListComponent extends Component {
  constructor(props) {
    super(props);
    this.showEvents = this.showEvents.bind(this);
    this.state = {
      localPermission: "unknown",
      position: "unknown",
      hashedLocation: "unknown",
      distance: 50,
      region: {
        latitude: 49.28355919,
        latitudeDelta: 0.8014639600118514,
        longitude: -123.1153489,
        longitudeDelta: 0.6370953742537893
      },
      events: {}
    };
  }

  _getLocationPermissions = async () => {
    let { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({ locationPermission: false });
    } else {
      this.setState({ locationPermission: true });
    }
  };

  UNSAFE_componentWillMount() {
    this._getLocationPermissions();

    navigator.geolocation.getCurrentPosition(
      position => {
        console.log(position.coords);
        console.log(
          "My position: " +
            position.coords.latitude +
            ", " +
            position.coords.longitude
        );
        let coordinates =
          position.coords.latitude + ", " + position.coords.longitude;
        var hashedLocation = geohash.encode(
          position.coords.latitude,
          position.coords.longitude
        );
        fetch(
          "https://app.ticketmaster.com/discovery/v2/events.json?geoPoint=" +
            hashedLocation +
            "&apikey=PGmtfFqe3FZdSKv39Yqih27wTCcgvPWO"
        )
          .then(response => response.json())
          .then(responseJson => {
            for (var i = 0; i < responseJson._embedded.events.length; i++) {
              if (responseJson._embedded.events[i].distance < 50) {
                console.log(responseJson._embedded.events[i].name);
              }
            }
            this.setState({
              events: responseJson._embedded.events,
              hashedLocation: hashedLocation
            });
            return responseJson;
          })
          .catch(error => {
            console.error(error);
          });
        this.setState({
          position: coordinates,
          hashedLocation: hashedLocation
        });
      },
      error => alert(JSON.stringify(error))
    );
  }

  componentDidMount() {}

  getEvents = () => {
    return fetch(
      "https://app.ticketmaster.com/discovery/v2/events.json?geoPoint=" +
        this.state.hashedLocation +
        "&apikey=PGmtfFqe3FZdSKv39Yqih27wTCcgvPWO"
    )
      .then(response => response.json())
      .then(responseJson => {
        for (var i = 0; i < responseJson._embedded.events.length; i++) {
          console.log(responseJson._embedded.events[i].name);
        }
        return responseJson;
      })
      .catch(error => {
        console.error(error);
      });
  };

  showEvents() {
    return this.state.events.forEach(function(event, i) {
      this.state.event.push(
        <View key={i} style="container">
          <Text>{event.name}</Text>
        </View>
      );
    });
  }

  render() {
    var eventList = [];

    for (let event = 0; event < this.state.events.length; event++) {
      console.log(this.state.events[event]);
      eventList.push(this.state.events[event]);
    }

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={eventList}
            renderItem={({ item }) => <Item title={item.name} />}
            keyExtractor={item => item.id}
          />
        </SafeAreaView>
        <View style={styles.container}>
          <Text>{this.state.position}</Text>
          {eventList.map(event => (
            <Text>{event.name}</Text>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  paragraph: {
    margin: 6,
    fontSize: 18,
    textAlign: "center"
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16
  },
  title: {
    fontSize: 32
  }
});
