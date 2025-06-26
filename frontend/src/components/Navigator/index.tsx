import React from 'react';

import {
  type NativeStackNavigationProp
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBar from './TabBar';

import Home from '../../pages/Home';
import Races from '../../pages/Races';
import UserProfile from '../../pages/UserProfile';

import useAuth from '../../hooks/useAuth';

// https://reactnavigation.org/docs/typescript/
// The type containing the mapping must be a type alias
// (e.g. type RootStackParamList = { ... }). It cannot be an interface
// It also shouldn't extend ParamListBase (e.g. interface
// RootStackParamList extends ParamListBase { ... }).
type RootStackParamList = {
  Home: undefined;
  Races: undefined;
  UserProfile: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

const Navigator = () => {
  const { displayName, isSignedIn } = useAuth();

  return(
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: "shift"
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Races"
        component={Races}
        options={{ title: "Races" }}
      />
      <Tab.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ title: isSignedIn ? displayName : "Sign In" }}
      />
    </Tab.Navigator>
  );
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default Navigator;
