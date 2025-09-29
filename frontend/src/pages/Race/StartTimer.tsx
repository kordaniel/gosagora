import React from 'react';

import { ScrollView } from 'react-native';

import Button from '../../components/Button';
import StyledText from '../../components/StyledText';

import { timeDurationToString } from '../../utils/stringTools';
import useStartTimer from '../../hooks/useStartTimer';

const StartTimer = () => {
  const startTimerState = useStartTimer();
  return (
    <ScrollView>
      <StyledText>{timeDurationToString(startTimerState.timeLeft)}</StyledText>
      <Button disabled={true}><StyledText variant="button">-1 Min</StyledText></Button>
      <Button disabled={true}><StyledText variant="button">+1 Min</StyledText></Button>
      <Button disabled={startTimerState.isCounting} onPress={startTimerState.reset}><StyledText variant="button">Reset</StyledText></Button>
      <Button disabled={true}><StyledText variant="button">Sync</StyledText></Button>
      {startTimerState.isCounting
        ? <Button onPress={startTimerState.pause}><StyledText variant="button">Pause</StyledText></Button>
        : <Button onPress={startTimerState.start}><StyledText variant="button">Start</StyledText></Button>
      }
    </ScrollView>
  );
};

export default StartTimer;
