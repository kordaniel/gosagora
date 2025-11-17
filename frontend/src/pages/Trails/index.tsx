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

import NewTrail from './NewTrail';
import TrailView from './TrailView';
import TrailsList from './TrailsList';

import type { AppTheme } from '../../types';

const routes: Route[] = [
  { key: 'newTrail', title: 'New Trail' },
  { key: 'trailsList', title: 'Trails' },
  { key: 'trailView', title: 'Trail' },
];

const renderScene = SceneMap({
  newTrail: NewTrail,
  trailsList: TrailsList,
  trailView: TrailView,
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

const Trails = () => {
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
        lazy={({ route }) => route.key === 'newTrail' || route.key === 'trailView'}
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

export default Trails;
