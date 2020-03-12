import React, { Component } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  Button
} from "react-native";
import { Dropdown } from "react-native-material-dropdown";

import PropTypes from "prop-types";
import geohash from "ngeohash";

import * as Permissions from "expo-permissions";

import HeaderComponent from "./HeaderComponent";

export default class EventListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localPermission: "unknown",
      position: "unknown",
      hashedLocation: "unknown",
      distance: 50,
      events: {},
      searchString: "",
      searchDistance: 50
    };
    this.updateSearch = this.updateSearch.bind(this);
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
            console.log("componentwillmount");
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

  updateSearch = () => {
    this._getLocationPermissions();

    navigator.geolocation.getCurrentPosition(position => {
      console.log(position.coords);
      console.log(
        "My updated position: " +
          position.coords.latitude +
          ", " +
          position.coords.longitude
      );

      var hashedLocation = geohash.encode(
        position.coords.latitude,
        position.coords.longitude
      );

      this.setState({
        hashedLocation: hashedLocation
      });
    });

    if (this.state.searchString != "") {
      var hashedLocation = this.state.hashedLocation;
      var searchString = this.state.searchString;
      fetch(
        "https://app.ticketmaster.com/discovery/v2/events.json?geoPoint=" +
          hashedLocation +
          "&keyword=" +
          searchString +
          "&apikey=PGmtfFqe3FZdSKv39Yqih27wTCcgvPWO"
      )
        .then(response => response.json())
        .then(responseJson => {
          let events = [];
          console.log(typeof responseJson);
          if (typeof responseJson == "object") {
            for (var i = 0; i < responseJson._embedded.events.length; i++) {
              if (
                responseJson._embedded.events[i].distance <
                this.state.searchDistance
              ) {
                console.log(responseJson._embedded.events[i].name);
                events.push(responseJson._embedded.events[i]);
              }
            }
            console.log("updateSearch");
            this.setState({
              events: events
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
    if (this.state.searchString == "") {
      var hashedLocation = this.state.hashedLocation;
      fetch(
        "https://app.ticketmaster.com/discovery/v2/events.json?geoPoint=" +
          hashedLocation +
          "&apikey=PGmtfFqe3FZdSKv39Yqih27wTCcgvPWO"
      )
        .then(response => response.json())
        .then(responseJson => {
          let events = [];
          console.log(typeof responseJson);
          if (typeof responseJson == "object") {
            for (var i = 0; i < responseJson._embedded.events.length; i++) {
              if (
                responseJson._embedded.events[i].distance <
                this.state.searchDistance
              ) {
                console.log(responseJson._embedded.events[i].name);
                events.push(responseJson._embedded.events[i]);
              }
            }
            console.log("updateSearch");
            this.setState({
              events: events
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  searchInput = userInput => {
    this.setState({ searchString: userInput });
  };

  render() {
    var eventList = [];
    console.log(this.state.searchString);
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

    return (
      <View style={styles.container}>
        <HeaderComponent />

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
          <Button title="Search" onPress={() => this.updateSearch()} />
        </View>

        <FlatList
          data={eventList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("Details", {
                  someId: 100,
                  eventUrl: item.url,
                  imageUrl: item.images[0].url
                })
              }
            >
              <Image
                style={styles.item_image}
                source={{ uri: item.images[0].url }}
              />
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
