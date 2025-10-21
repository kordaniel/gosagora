import React from 'react';

import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

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
  return (
    <View style={styles.compassContainer}>
      <View style={[
        styles.compassDial,
        { transform: [{ rotate: `-${heading ?? 0}deg` }] }
      ]}>
        {CARDINAL_LABELS.map((dir, i) => (
          <Text
            key={i}
            style={[
              styles.cardinalText,
              {
                position: 'absolute',
                transform: [
                  { rotate: `${i * 15}deg` },
                  { translateY: i % 6 === 0 ? -65 : -62 }
                ]
              }
            ]}
          >
            {dir}
          </Text>
        ))}
        <View style={[
          styles.markerNorth,
          { transform: [ { translateY: -48 } ] }
        ]} />
        <View style={[
          styles.markerHeading,
          {
            position: 'absolute',
            transform: [
              { rotate: `${heading ?? 0}deg` },
              { translateY: -48 }
            ],
          }
        ]} />
      </View>
      <View style={styles.headingTextContainer}>
        <Text style={styles.headingLabel}>
          {getCardinalDirection(heading)}
        </Text>
        <Text style={styles.headingValue}>
          {headingToString(heading, 0)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardinalText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassDial: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderColor: '#F9F9F9',
    borderRadius: 75,
    borderWidth: 20,
    height: 150,
    justifyContent: 'center',
    width: 150,
  },
  headingLabel: {
    color: '#333',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  headingTextContainer: {
    alignItems: 'center',
    position: 'absolute',
  },
  headingValue: {
    color: '#333',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  markerHeading: {
    borderBottomColor: '#FFF',
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderLeftWidth: 3,
    borderRightColor: 'transparent',
    borderRightWidth: 3,
    height: 0,
    width: 0,
  },
  markerNorth: {
    borderBottomColor: 'red',
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderLeftWidth: 5,
    borderRightColor: 'transparent',
    borderRightWidth: 5,
    height: 0,
    width: 0,
  },
});

export default Compass;
