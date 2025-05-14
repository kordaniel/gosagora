import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import Button from 'src/components/Button';
import Separator from '../components/Separator';
import StyledText from '../components/StyledText';

import type { AppTheme } from '../types';
import type { NavigationProps } from '../components/Navigator';

const Home = () => {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation<NavigationProps>();

  return (
    <SafeAreaView style={theme.styles.primaryContainer}>
      <StyledText variant="headline">GosaGora</StyledText>
      <Separator />
      <StyledText>Welcome to GosaGora!</StyledText>
      <Button onPress={() => navigation.navigate('UserProfile')}>
        <StyledText variant="button">
          Go to Profile
        </StyledText>
      </Button>
      <Button onPress={() => navigation.navigate("Authentication")}>
        <StyledText variant="button">
          Go to Authentication
        </StyledText>
      </Button>
      <Button onPress={() => navigation.push("Home")}>
        <StyledText variant="button">
          Go to Home
        </StyledText>
      </Button>
      <Button onPress={() => navigation.goBack()}>
        <StyledText variant="button">
          Go back
        </StyledText>
      </Button>
    </SafeAreaView>
  );
};

export default Home;
