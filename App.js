// eslint-disable-next-line no-unused-vars
import React from 'react';
// eslint-disable-next-line no-unused-vars
import { StyleSheet, Text, View } from 'react-native';

// import react Navigation
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// Create the navigator
const navigator = createStackNavigator({
  Start: { screen: Start },
  Chat: { screen: Chat },
});

const navigatorContainer = createAppContainer(navigator);
// Export it as the root component
export default navigatorContainer;
