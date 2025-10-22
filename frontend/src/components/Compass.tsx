import React from 'react';

import { Text, useTheme } from 'react-native-paper';
import { View } from 'react-native';

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
}

const Compass = ({ heading }: CompassProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <View style={theme.styles.centerContainer}>
      <View style={theme.styles.compassOuterDial}>
        <View style={[
          theme.styles.compassDial,
          { transform: [{ rotate: `-${heading ?? 0}deg` }] }
        ]}>
          {CARDINAL_LABELS.map((dir, i) => (
            <Text
              key={i}
              variant="titleMedium"
              style={[
                {
                  color: theme.colors.onSurface,
                  fontWeight: "bold",
                  position: 'absolute',
                  transform: [
                    { rotate: `${i * 15}deg` },
                    { translateY: i % 6 === 0 ? -69 : -66 }
                  ]
                }
              ]}
            >
              {dir}
            </Text>
          ))}
          <View style={[
            theme.styles.compassMarkerNorth,
            { transform: [ { translateY: -77 } ] }
          ]} />
          <View style={[
            theme.styles.compassMarkerHeading,
            {
              position: 'absolute',
              transform: [
                { rotate: `${heading ?? 0}deg` },
                { translateY: -50 }
              ],
            }
          ]} />
        </View>
      </View>
      <View style={theme.styles.compassTextContainer}>
        <Text variant="headlineLarge" style={{
          color: theme.colors.onSurfaceVariant,
          fontWeight: "bold"
        }}>
          {getCardinalDirection(heading)}
        </Text>
        <Text variant="headlineMedium" style={{
          color: theme.colors.onSurfaceVariant,
          fontWeight: "bold"
        }}>
          {headingToString(heading, 0)}
        </Text>
      </View>
    </View>
  );
};

export default Compass;
