import React, { useState } from 'react';

import { Button, Text, useTheme } from 'react-native-paper';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

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
  const style = StyleSheet.create({
    scrollView: {
      alignItems: 'stretch',
      flex: 1,
      gap: 8,
      justifyContent: 'space-between',
      paddingHorizontal: 3,
      paddingVertical: 12,
    }
  });

  const halfWidth = clampNumber(Math.floor(0.5 * width) - 15, 120, 300); // NOTE: Leave room for flex gap & margins
  const dms = decimalCoordsToDMSString(
    currentPosition !== null ? { lat: currentPosition.lat, lon: currentPosition.lon } : null
  );

  const toggleTracking = () => {
    if (trackingStatus === 'idle') {
      void startTracking();
    } else {
      stopTracking(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={style.scrollView}>
      <ErrorRenderer>{error}</ErrorRenderer>
      <View style={theme.styles.containerFlexColumn}>
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
              <Text variant="headlineMedium">SOG:</Text>
              <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>{velocityToString(currentPosition?.vel)}</Text>
            </View>
            <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>{dms.lat}</Text>
            <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>{dms.lon}</Text>
          </View>
        </View>
        <Text>Last position received at: {dateOrTimestampToString(currentPosition?.timestamp)}</Text>
        <Text>Signal quality: {geoPosAccuracyQualityToString(signalQuality, currentPosition?.acc)}</Text>
      </View>
      <View style={theme.styles.containerFlexColumn}>
        <Text>Location services status: {trackingStatus}</Text>
        <Button mode="outlined" onPress={() => setRenderCompassNorthUp(prev => !prev)}>
          {renderCompassNorthUp
            ? "Switch Compass to Head-Up mode"
            : "Switch Compass to North-Up mode"
          }
        </Button>
        <Button mode="outlined" onPress={toggleTracking}>
          {trackingStatus === "idle" ? "Enable Location Services" : "Turn Off Location Services"}
        </Button>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
