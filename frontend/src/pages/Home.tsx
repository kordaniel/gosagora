import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
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
    <SafeAreaView style={theme.styles.safeAreaView}>
      <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
        <StyledText variant="headline">GosaGora</StyledText>
        <Separator />
        <StyledText variant="title">Welcome to GosaGora!</StyledText>
        <Button onPress={() => navigation.navigate('UserProfile')}>
            Profile
        </Button>
        <Button onPress={() => navigation.push("Home")}>
          Home
        </Button>
        <Button onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
