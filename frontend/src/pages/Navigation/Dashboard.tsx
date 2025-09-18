import React from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Button from '../../components/Button';
import StyledText from '../../components/StyledText';

import type { AppTheme, GeoPos } from '../../types';
import { SelectLocation, setLocationHistoryMaxLen } from '../../store/slices/locationSlice';
import {
  dateOrTimestampToString,
  decimalCoordsToDMSString,
  distanceToString,
  headingToString,
  percentageToString,
  velocityToString,
} from '../../utils/stringTools';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { DistanceUnits } from '../../utils/unitConverter';
import useLocation from '../../hooks/useLocation';

const GeoPosView = ({ pos }: { pos: GeoPos | null }) => {
  const theme = useTheme<AppTheme>();
  const style = StyleSheet.compose(
    theme.styles.borderContainer,
    theme.styles.containerFlexRow
  );

  if (!pos) {
    return (
      <View style={theme.styles.borderContainer}>
        <StyledText>No location..</StyledText>
      </View>
    );
  }

  const dms = decimalCoordsToDMSString({ lat: pos.lat, lon: pos.lon });

  return (
    <View style={style}>
      <View style={theme.styles.containerFlexColumn}>
        <View>
          <StyledText>LAT</StyledText>
          <StyledText>{dms.lat}</StyledText>
        </View>
        <View>
          <StyledText>SOG</StyledText>
          <StyledText>{velocityToString(pos.vel)}</StyledText>
        </View>
        <View>
          <StyledText>TIME</StyledText>
          <StyledText>{dateOrTimestampToString(pos.timestamp)}</StyledText>
        </View>
      </View>
      <View style={theme.styles.containerFlexColumn}>
        <View>
          <StyledText>LON</StyledText>
          <StyledText>{dms.lon}</StyledText>
        </View>
        <View>
          <StyledText>COG</StyledText>
          <StyledText>{headingToString(pos.hdg)}</StyledText>
        </View>
        <View>
          <StyledText>ACC</StyledText>
          <StyledText>{distanceToString(pos.acc, DistanceUnits.Meters)}</StyledText>
        </View>
      </View>
    </View>
  );
};

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const {
    current,
    history,
    historyMaxLen,
    trackingStatus,
    signalQuality
  } = useAppSelector(SelectLocation);
  const { startTracking, stopTracking } = useLocation();

  return (
    <ScrollView>
      <StyledText variant="headline">GosaGora Dashboard</StyledText>
      <StyledText>Status: {trackingStatus}. Signal: {percentageToString(signalQuality)}</StyledText>
      <StyledText>History max length: {historyMaxLen}, current length: {history.length}</StyledText>
      <Button
        onPress={() => dispatch(setLocationHistoryMaxLen(2 * historyMaxLen))}
      >
        Increase history max len
      </Button>
      <Button
        onPress={() => dispatch(setLocationHistoryMaxLen(Math.ceil(0.5 * historyMaxLen)))}
      >
        Shorten history max len
      </Button>
      <Button onPress={startTracking as () => void} disabled={trackingStatus !== 'idle'}>Start tracking</Button>
      <Button onPress={stopTracking} disabled={trackingStatus === 'idle'}>Stop tracking</Button>
      <StyledText variant="title">Current position</StyledText>
      <GeoPosView pos={current} />
      <StyledText variant="title">History</StyledText>
      {history
        .slice(-50)
        .reduceRight<Array<GeoPos | null>>((acc, cur) => acc.concat(cur), [])
        .map(pos => pos ? <GeoPosView key={pos.id} pos={pos} /> : null)
      }
    </ScrollView>
  );
};

export default Dashboard;
