/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';

import Shomer from './Shomer';
import Admin from './Admin';
import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
}
const Stack = createStackNavigator();

function MyStack() {
  useEffect(() => {
    requestUserPermission();
  }, [])
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
