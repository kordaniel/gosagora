import React from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import Button from '../../../components/Button';
import TimeSelector from './TimeSelector';

import type { AppTheme, TimeDuration } from '../../../types';
import { timeDurationToString } from '../../../utils/stringTools';
import useStartTimer from '../../../hooks/useStartTimer';

const RenderTimeLeft = ({ timeLeft }: { timeLeft: TimeDuration }) => {
  const theme = useTheme<AppTheme>();
  const style = StyleSheet.compose(
    theme.customFonts.displayHugeBold,
    { textAlign: 'center' }
  );

  return (
    <Text style={style}>{timeDurationToString(timeLeft)}</Text>
  );
};

const StartTimer = () => {
  const theme = useTheme<AppTheme>();
  const startTimer = useStartTimer();

  return (
    <ScrollView contentContainerStyle={{ flexDirection: "column" }}>
      <RenderTimeLeft timeLeft={startTimer.timeLeft} />
      <TimeSelector setDuration={startTimer.setDuration} />

      <View style={{ flexDirection: "column" }}>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Button
            style={{ flexGrow: 1 }}
            disabled={startTimer.remainsAtMost(0, 1)}
            onPress={() => startTimer.addToCountdown(0, -1)}
          >
            -1 Min
          </Button>
          <Button
            style={{ flexGrow: 1 }}
            onPress={() => startTimer.addToCountdown(0, 1)}
          >
            +1 Min
          </Button>
        </View>
        <Button
          disabled={startTimer.isCounting}
          onPress={startTimer.reset}>
            Reset
        </Button>
        <Button
          disabled={!startTimer.canSync}
          onPress={startTimer.sync}
        >
          Sync
        </Button>
        {startTimer.isCounting
          ? <Button
              colors={[theme.colors.error, "white"]}
              ctxLoading={startTimer.isCounting}
              onPress={startTimer.pause}
            >
              Pause
            </Button>
          : <Button
              colors={[theme.colors.tertiary, "white"]}
              onPress={startTimer.start}
            >
              Start
            </Button>
        }
      </View>
    </ScrollView>
  );
};

export default StartTimer;
