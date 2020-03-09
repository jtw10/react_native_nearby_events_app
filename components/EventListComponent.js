import React, { Component } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
  Button,
  TextInput,
  SafeAreaView,
  Image,
  Picker
} from "react-native";
import { Dropdown } from "react-native-material-dropdown";

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
      events: {},
      searchString: "",
      searchDistance: 50
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
            let events = [];
            for (var i = 0; i < responseJson._embedded.events.length; i++) {
              if (
                responseJson._embedded.events[i].distance <
                this.state.searchDistance
              ) {
                events.push(responseJson._embedded.events[i]);
              }
            }
            this.setState({
              events: events,
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

  searchInput = userInput => {
    this.setState({ searchString: userInput });
  };

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

    let selectableDistance = [
      {
        value: 5
      },
      {
        value: 10
      },
      {
        value: 20
      },
      {
        value: 50
      }
    ];

    for (let event = 0; event < this.state.events.length; event++) {
      if (this.state.events[event].distance < this.state.searchDistance) {
        eventList.push(this.state.events[event]);
      }
    }

    console.log(this.state.searchDistance);
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.searchbar}
          underlineColorAndroid="transparent"
          placeholder="Search by event name"
          onChangeText={this.searchInput}
        />
        <View style={styles.searchbar_range}>
          <Dropdown
            label="Search Range (miles)"
            data={selectableDistance}
            onChangeText={value => {
              this.setState({ searchDistance: value });
            }}
          />
        </View>

        <FlatList
          data={eventList}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Image
                style={styles.item_image}
                source={{ uri: item.images[0].url }}
              ></Image>
              <Text style={styles.item_text}>
                {item.name}
                {"\n"}
                {item.distance} mi.
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
        <View style={styles.container}>
          <Text style={styles.bottom_margin}></Text>
        </View>
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
