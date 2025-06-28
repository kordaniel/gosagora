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

import NewRace from './NewRace';
import RacesView from './RacesView';

import { AppTheme } from '../../types';

// react-navigation-tab-view documentation: https://reactnavigation.org/docs/tab-view/

export type SceneMapRouteProps = Omit<SceneRendererProps, 'layout'> & { route: Route; };

const routes: Route[] = [
  { key: 'newRace', title: 'New Race' },
  { key: 'racesList', title: 'Races' },
];

// NOTE: Do not pass inline functions to SceneMap!
//       If additional props are required, use a custom renderScene function
//       and also memoize the rendered components!
const renderScene = SceneMap({
  newRace: NewRace,
  racesList: RacesView,
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

const Races = () => {
  const theme = useTheme<AppTheme>();
  const [tabViewIndex, setTabViewIndex] = useState<number>(1);
  const layout = useWindowDimensions();

  return (
    <SafeAreaView style={theme.styles.safeAreaView}>
      <TabView
        animationEnabled={true}
        initialLayout={{
          height: 0,
          width: layout.width
        }}
        lazy={({ route }) => route.key === 'newRace' }
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

export default Races;
