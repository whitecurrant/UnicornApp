/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * 
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  UIManager,
} from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { SignupScene } from './SignupScene';
import { MainScene } from './MainScene';
import { Colors } from './Colors'
import { Routes } from './Routes';

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


const RootNavigator = createStackNavigator(
  {
    [Routes.Signup]: SignupScene,
    [Routes.Main]: MainScene,
  },
  {
    initialRouteName: Routes.Signup,
    defaultNavigationOptions: {
      header: null,
    },
  },
);
const AppNavigator = createAppContainer(RootNavigator);

const App = () => {
  return (
    <Fragment>
      <StatusBar barStyle="light-content" backgroundColor={Colors.unicorn} />
      <AppNavigator />
    </Fragment>
  );
};


export default App;
