import React from 'react';

import {
  type NativeStackNavigationProp
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBar from './TabBar';

import Authentication from '../../pages/Authentication';
import Home from '../..//pages/Home';
import UserProfile from '../../pages/UserProfile';

// https://reactnavigation.org/docs/typescript/
// The type containing the mapping must be a type alias
// (e.g. type RootStackParamList = { ... }). It cannot be an interface
// It also shouldn't extend ParamListBase (e.g. interface
// RootStackParamList extends ParamListBase { ... }).
type RootStackParamList = {
  Authentication: undefined;
  Home: undefined;
  UserProfile: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

const Navigator = () => {
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
        name="Authentication"
        component={Authentication}
      />
      <Tab.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default Navigator;
