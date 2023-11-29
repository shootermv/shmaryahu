/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';

import Shomer from './Shomer';
import Admin from './Admin';
import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  await messaging().requestPermission();
}
const Stack = createStackNavigator();

function MyStack() {
  useEffect(() => {
    requestUserPermission();
  }, []);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Admin"
        component={Admin}
        options={{
          title: 'שמירות',
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: 'tomato'},
        }}
      />
      <Stack.Screen
        name="Shomer"
        component={Shomer}
        options={{
          title: 'שמירה',
          headerTitleAlign: 'center',
          headerTintColor: 'white',
          headerStyle: {backgroundColor: 'tomato'},
          headerLeft: () => null,
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
