import React from 'react';

import { Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { useLinkBuilder } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import { AppTheme } from 'src/types';

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const theme = useTheme<AppTheme>();
  const { buildHref } = useLinkBuilder();

  return (
    <View style={theme.styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
            ? options.title
            : route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={index}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : { }}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={theme.styles.tabBarTab}
          >
            <Text style={{ color: isFocused ? theme.colors.onSurfaceVariant : theme.colors.onSurfaceDisabled }}>
              {label as string}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
};

export default TabBar;
