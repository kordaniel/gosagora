import React from 'react';

import {
  type NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

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

const RootStack = createNativeStackNavigator<RootStackParamList>();

const Navigator = () => {
  return (
    <RootStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: "tomato" },
      }}
    >
      <RootStack.Screen
        name="Authentication"
        component={Authentication}
      />
      <RootStack.Screen
        name="Home"
        component={Home}
        options={{ title: "GosaGora" }}
      />
      <RootStack.Screen
        name="UserProfile"
        component={UserProfile}
      />
    </RootStack.Navigator>
  );
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default Navigator;
