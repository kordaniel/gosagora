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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useWindowDimensions } from 'react-native';

import Dashboard from './Dashboard';
import Map from './Map';

import type { AppTheme } from '../../types';
import useLocation from '../../hooks/useLocation';

const routes: Route[] = [
  { key: 'dashboard', title: 'Dashboard' },
  { key: 'map', title: 'Map' },
];

const renderScene = SceneMap({
  dashboard: Dashboard,
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

const Navigation = () => {
  const theme = useTheme<AppTheme>();
  const [tabViewIndex, setTabViewIndex] = useState<number>(0);
  const layout = useWindowDimensions();
  useLocation();

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

export default Navigation;
