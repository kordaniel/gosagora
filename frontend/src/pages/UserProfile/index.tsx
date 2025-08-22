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
import { ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

import Authentication from '../../components/Authentication';
import SignedInView from './SignedInView';
import UserBoats from './UserBoats';

import { type AppTheme } from '../../types';
import { SelectAuth } from '../../store/slices/authSlice';
import { useAppSelector } from '../../store/hooks';


const routes: Route[] = [
  { key: 'userProfile', title: 'My Profile' },
  { key: 'userBoats', title: 'My Boats' },
];

// NOTE: Do not pass inline functions to SceneMap!
//       If additional props are required, use a custom renderScene function
//       and also memoize the rendered components!
const renderScene = SceneMap({
  userProfile: SignedInView,
  userBoats: UserBoats,
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

const UserProfile = () => {
  const theme = useTheme<AppTheme>();
  const { isAuthenticated } = useAppSelector(SelectAuth);
  const [tabViewIndex, setTabViewIndex] = useState<number>(0);
  const layout = useWindowDimensions();

  return (
    <SafeAreaView style={theme.styles.safeAreaView}>
      {!isAuthenticated
        ? <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
            <Authentication />
          </ScrollView>
        : <TabView
            animationEnabled={true}
            initialLayout={{
              height: 0,
              width: layout.width
            }}
            lazy={({ route }) => route.key === 'userBoats' }
            navigationState={{ index: tabViewIndex, routes }}
            onIndexChange={setTabViewIndex}
            renderScene={renderScene}
            renderTabBar={createRenderTabBar(theme)}
            swipeEnabled={true}
            tabBarPosition="top"
          />
      }
    </SafeAreaView>
  );
};

export default UserProfile;
