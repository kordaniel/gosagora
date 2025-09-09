import React, { useState } from 'react';

import {
  type NavigationState,
  type Route,
  SceneMap,
  type SceneRendererProps,
  TabBar,
  type TabDescriptor,
  TabView,
} from 'react-native-tab-view';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

import Separator from '../../components/Separator';
import StyledText from '../../components/StyledText';

import type { AppTheme, GeoPos } from '../../types';
import { SelectLocation } from '../../store/slices/locationSlice';
import { useAppSelector } from '../../store/hooks';
import useLocation from '../../hooks/useLocation';


const Map = () => {
  return (
    <ScrollView>
      <StyledText variant="headline">Map</StyledText>
      <StyledText>Filler...</StyledText>
    </ScrollView>
  );
};

const LocationView = ({ loc }: { loc: GeoPos }) => {
  return (
    <View style={{ borderWidth: 1 }}>
      <StyledText variant="title">TME: {new Date(loc.timestamp).toLocaleTimeString()}</StyledText>
      <StyledText>LAT: {loc.lat}</StyledText>
      <StyledText>LON: {loc.lon}</StyledText>
      <StyledText>ACC: {loc.acc ?? "-"}</StyledText>
      <StyledText>VEL: {loc.vel ?? "-"}</StyledText>
      <StyledText>HDG: {loc.hdg ?? "-"}</StyledText>
    </View>
  );
};

const Gps = () => {
  const { isInitialized } = useLocation();
  const { current, history } = useAppSelector(SelectLocation);

  return (
    <ScrollView>
      <StyledText variant="headline">Geolocation</StyledText>
      <StyledText>{isInitialized ? 'subscribed' : 'waiting'}</StyledText>
      {current === null
        ? <StyledText variant="title">No current location..</StyledText>
        : <LocationView loc={current} />
      }
      <Separator />
      <StyledText variant="title">History</StyledText>
      {history
        .reduceRight<Array<GeoPos | null>>((acc, cur) => acc.concat(cur), [])
        .map((loc) => !loc ? null : <LocationView key={loc.timestamp} loc={loc} />)
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
