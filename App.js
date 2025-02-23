import React from "react";
import { StyleSheet } from "react-native";

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import EventListComponent from "./components/EventListComponent";
import EventDetailComponent from "./components/EventDetailComponent";

const RootStack = createStackNavigator(
  {
    Events: {
      screen: EventListComponent
    },
    Details: {
      screen: EventDetailComponent
    }
  },
  {
    initialRouteName: "Events"
  }
);

const AppContainer = createAppContainer(RootStack);

console.disableYellowBox = true;

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF4FD"
  }
});
