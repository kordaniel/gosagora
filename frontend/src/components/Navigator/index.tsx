import React from 'react';

import {
  type NativeStackNavigationProp
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBar from './TabBar';

import Home from '../../pages/Home';
import Navigation from '../../pages/Navigation';
import Races from '../../pages/Races';
import UserProfile from '../../pages/UserProfile';

import { SelectAuth } from '../../store/slices/authSlice';
import { useAppSelector } from '../../store/hooks';

// https://reactnavigation.org/docs/typescript/
// The type containing the mapping must be a type alias
// (e.g. type RootStackParamList = { ... }). It cannot be an interface
// It also shouldn't extend ParamListBase (e.g. interface
// RootStackParamList extends ParamListBase { ... }).
type RootStackParamList = {
  UserProfile: undefined;
  Races: undefined;
  Home: undefined;
  Navigation: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

const Navigator = () => {
  const { user, isAuthenticated } = useAppSelector(SelectAuth);

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
        name="UserProfile"
        component={UserProfile}
        options={{ title: isAuthenticated ? user?.displayName : "Sign In" }}
      />
      <Tab.Screen
        name="Races"
        component={Races}
        options={{ title: "Races" }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Navigation"
        component={Navigation}
        options={{ title: "Navigation" }}
      />
    </Tab.Navigator>
  );
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default Navigator;
