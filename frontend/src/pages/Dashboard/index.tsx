import React, { useState } from 'react';

import * as Location from 'expo-location';
import {
  type NavigationState,
  type Route,
  SceneMap,
  type SceneRendererProps,
  TabBar,
  type TabDescriptor,
  TabView,
} from 'react-native-tab-view';
import { ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

import Button from '../../components/Button';
import StyledText from '../../components/StyledText';

import { type AppTheme } from '../../types';


const Map = () => {
  return (
    <ScrollView>
      <StyledText variant="headline">Map</StyledText>
      <StyledText>Filler...</StyledText>
    </ScrollView>
  );
};

const Gps = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== Location.PermissionStatus.GRANTED) {
      setErrorMsg('Permission to access location was denied');
      setLocation(null);
    } else {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setErrorMsg(null);
    }
    setIsLoading(false);
  };

  return (
    <ScrollView>
      <StyledText variant="headline">Geolocation</StyledText>
      <Button
        ctxLoading={isLoading}
        onPress={getCurrentLocation as () => void}
      >
        Update location
      </Button>
      {errorMsg && <StyledText>{errorMsg}</StyledText>}
      {location === null ?
          <StyledText>No current location..</StyledText>
        : <>
            <StyledText>Current location</StyledText>
            <StyledText>TME: {new Date(location.timestamp).toLocaleTimeString()}</StyledText>
            <StyledText>LAT: {location.coords.latitude}</StyledText>
            <StyledText>LON: {location.coords.longitude}</StyledText>
            <StyledText>ACC: {location.coords.accuracy}</StyledText>
            <StyledText>VEL: {location.coords.speed}</StyledText>
            <StyledText>HDG: {location.coords.heading}</StyledText>
            <StyledText>ALT: {location.coords.altitude}</StyledText>
            <StyledText>ALT ACC: {location.coords.altitudeAccuracy}</StyledText>
          </>
      }
    </ScrollView>
  );
};

const routes: Route[] = [
  { key: 'gps', title: 'GPS' },
  { key: 'map', title: 'Map' },
];

const renderScene = SceneMap({
  gps: Gps,
  map: Map,
});

const createRenderTabBar = (theme: AppTheme) =>
  // NOTE: Returned function should be a named function (eslint), helps debugging tools
  function renderTabBar(props: SceneRendererProps & {
    navigationState: NavigationState<Route>;
    options: Record<string, TabDescriptor<Route>> | undefined;
  }) {
    return (
      <TabBar
        indicatorStyle={{ backgroundColor: theme.colors.primary }}
        activeColor={theme.colors.primary}
        inactiveColor={theme.colors.onPrimary}
        style={{ backgroundColor: theme.colors.inversePrimary }}
        scrollEnabled={false}
        {...props}
      />
    );
  };

const Dashboard = () => {
  const theme = useTheme<AppTheme>();
  const [tabViewIndex, setTabViewIndex] = useState<number>(0);
  const layout = useWindowDimensions();

  return (
    <SafeAreaView style={theme.styles.safeAreaView}>
      <TabView
        animationEnabled={true}
        initialLayout={{
          height: 0,
          width: layout.width
        }}
        lazy={({ route }) => route.key === "map" }
        navigationState={{ index: tabViewIndex, routes }}
        onIndexChange={setTabViewIndex}
        renderScene={renderScene}
        renderTabBar={createRenderTabBar(theme)}
        swipeEnabled={true}
        tabBarPosition="top"
      />
    </SafeAreaView>
  );
};

export default Dashboard;
