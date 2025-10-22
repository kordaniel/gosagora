import React, { useState } from 'react';

import { ScrollView, View, useWindowDimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import Button from '../../components/Button';
import Compass from '../../components/Compass';
import ErrorRenderer from '../../components/ErrorRenderer';

import {
  dateOrTimestampToString,
  decimalCoordsToDMSString,
  geoPosAccuracyQualityToString,
  velocityToString,
} from '../../utils/stringTools';
import type { AppTheme } from '../../types';
import { SelectLocation } from '../../store/slices/locationSlice';
import { clampNumber } from '../../utils/helpers';
import { useAppSelector } from '../../store/hooks';
import useLocation from '../../hooks/useLocation';

const Dashboard = () => {
  const theme = useTheme<AppTheme>();
  const {
    currentPosition,
    error,
    trackingStatus,
    signalQuality
  } = useAppSelector(SelectLocation);
  const { startTracking, stopTracking } = useLocation();
  const { width } = useWindowDimensions();
  const [renderCompassNorthUp, setRenderCompassNorthUp] = useState<boolean>(false);

  const halfWidth = clampNumber(Math.floor(0.5 * width) - 15, 120, 300); // NOTE: Leave room for flex gap & margins
  const dms = decimalCoordsToDMSString(
    currentPosition !== null ? { lat: currentPosition.lat, lon: currentPosition.lon } : null
  );

  return (
    <ScrollView contentContainerStyle={[
      theme.styles.container,
      { flex: 1, paddingTop: 12 },
    ]}>
      <ErrorRenderer>{error}</ErrorRenderer>
      <View style={[
        theme.styles.containerFlexColumn,
        { alignItems: "center" }
      ]}>
        <View style={[
          theme.styles.containerFlexRow,
          { justifyContent: "center" }
        ]}>
          <Compass
            heading={currentPosition?.hdg}
            heightAndWidth={halfWidth}
            renderNorthUp={renderCompassNorthUp}
          />
          <View style={[theme.styles.containerFlexColumn, {
            justifyContent: "center",
            alignItems: "stretch",
            minWidth: Math.min(halfWidth, 150),
          }]}>
            <View style={[theme.styles.containerFlexRow, {
              justifyContent: "space-between",
            }]}>
              <Text variant="headlineMedium">SOG</Text>
              <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>{velocityToString(currentPosition?.vel)}</Text>
            </View>
            <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>{dms.lat}</Text>
            <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>{dms.lon}</Text>
          </View>
        </View>
        <View style={[theme.styles.containerFlexRow, { justifyContent: "space-between" }]}>
          <Text>Last fix</Text>
          <Text>{dateOrTimestampToString(currentPosition?.timestamp)}</Text>
        </View>
        <View style={[theme.styles.containerFlexRow, { justifyContent: "space-between" }]}>
          <Text>Signal quality</Text>
          <Text>{geoPosAccuracyQualityToString(signalQuality, currentPosition?.acc)}</Text>
        </View>
        <Text>Status: {trackingStatus}</Text>
        <Button onPress={() => setRenderCompassNorthUp(prev => !prev)}>{renderCompassNorthUp
          ? 'Set Compass to Head-Up mode'
          : 'Set Compass to North-Up mode'
        }</Button>
        <Button onPress={startTracking as () => void} disabled={trackingStatus !== 'idle'}>Start tracking</Button>
        <Button onPress={() => stopTracking(true)} disabled={trackingStatus === 'idle'}>Stop tracking</Button>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
