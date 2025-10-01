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

import StartTimer from './StartTimer';

import type { AppTheme } from '../../types';

const routes: Route[] = [
  // NOTE: Set lazy prop of Race TabView when adding routes
  { key: 'startTimer', title: 'Start Timer' },
];

const renderScene = SceneMap({
  startTimer: StartTimer,
});

const createRenderTabBar = (theme: AppTheme) =>
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

const Race = () => {
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
        lazy={false}
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

export default Race;
