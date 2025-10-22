import React from 'react';

import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import type { AppTheme } from '../types';
import { headingToString } from '../utils/stringTools';

const CARDINAL_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
const CARDINAL_LABELS = [
  'N',
  '°', '°', '°', '°', '°',
  'E',
  '°', '°', '°', '°', '°',
  'S',
  '°', '°', '°', '°', '°',
  'W',
  '°', '°', '°', '°', '°',
] as const;

const getCardinalDirection = (angle: number | undefined | null): string => {
  return angle === null || angle === undefined
    ? '--'
    : CARDINAL_DIRECTIONS[
      Math.round(angle / (360 / CARDINAL_DIRECTIONS.length)) % CARDINAL_DIRECTIONS.length
    ];
};

interface CompassProps {
  heading: number | undefined | null;
  renderNorthUp?: boolean;
  heightAndWidth?: number;
}

const Compass = ({
  heading,
  renderNorthUp = false,
  heightAndWidth = 150,
}: CompassProps) => {
  const theme = useTheme<AppTheme>();
  const radius = Math.ceil(0.5 * heightAndWidth);
  const cardinalLabelsAngle = Math.round(360 / CARDINAL_LABELS.length); // degrees between every label, including separator '°'
  const cardinalLabelsModulo = CARDINAL_LABELS.slice(1).findIndex(l => l !== '°') + 1; // indexes that contain an actual cardinal label (N,E,S,W) and not the separator '°'

  const styles = StyleSheet.create({
    dial: {
      ...theme.styles.compassDial,
      ...(!renderNorthUp && { transform: [{ rotate: `-${heading ?? 0}deg` }] }),
      borderRadius: radius,
      height: heightAndWidth,
      width: heightAndWidth,
    },
    outerDial: {
      ...theme.styles.compassOuterDial,
      borderRadius: radius,
      height: heightAndWidth + 6,
      width: heightAndWidth + 6,
    },
  });

  return (
    <View style={theme.styles.centerContainer}>
      <View style={styles.outerDial}>
        <View style={styles.dial}>
          {CARDINAL_LABELS.map((dir, i) => (
            <Text
              key={i}
              variant="titleMedium"
              style={[
                theme.styles.compassTextCardinal,
                {
                  transform: [
                    { rotate: `${i * cardinalLabelsAngle}deg` },
                    { translateY: i % cardinalLabelsModulo === 0 ? -radius+11 : -radius+14 }
                  ]
                }]}
            >
              {dir}
            </Text>
          ))}
          <View style={[
            theme.styles.compassMarkerNorth,
            { transform: [ { translateY: -radius+3 } ] } /* 3 == 0.5 * theme.styles.compassMarkerNorth.borderTopWidth */
          ]} />
          <View style={[
            theme.styles.compassMarkerHeading,
            {
              transform: [
                { rotate: `${heading ?? 0}deg` },
                { translateY: -radius+28 } /* 28 = 20+8 = theme.styles.compassdial + 0.5 * theme.styles.compassMarkerHeading.borderBottomWidth */
              ],
            }
          ]} />
        </View>
      </View>
      <View style={theme.styles.compassTextDialContainer}>
        <Text variant="headlineLarge" style={theme.styles.compassTextDial}>
          {getCardinalDirection(heading)}
        </Text>
        <Text variant="headlineMedium" style={theme.styles.compassTextDial}>
          {headingToString(heading, 0)}
        </Text>
      </View>
    </View>
  );
};

export default Compass;
