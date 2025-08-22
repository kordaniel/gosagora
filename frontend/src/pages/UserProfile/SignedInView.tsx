import React, { useState } from 'react';

import * as Yup from 'yup';
import { type GestureResponderEvent, ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Form, { type FormProps } from '../../components/Form';
import { FormInputType } from '../../components/Form/enums';

import Button from '../../components/Button';
import ErrorRenderer from '../../components/ErrorRenderer';
import LoadingOrErrorRenderer from '../../components/LoadingOrErrorRenderer';
import Separator from '../../components/Separator';
import StyledText from '../../components/StyledText';

import { SelectAuth, authSliceDeleteUser } from '../../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { AppTheme } from '../../types';
import { askConfirmation } from '../../helpers/askConfirmation';
import firebase from '../../modules/firebase';

export type PasswordValidationValuesType = {
  password: string;
};

const validationSchema: Yup.Schema<PasswordValidationValuesType> = Yup.object().shape({
  password: Yup.string()
    .trim()
    .min(8, 'Password must be at least 8 characters long')
    .max(30, 'Password can not be longer than 30 characters')
    .required('We need your password before we can proceed'),
});

const formFields: FormProps<PasswordValidationValuesType>['formFields'] = {
  password: {
    inputType: FormInputType.TextField,
    placeholder: 'Password',
    props: {
      autoCapitalize: 'none',
      autoComplete: 'off',
      autoCorrect: false,
      autoFocus: false,
      inputMode: 'text',
      secureTextEntry: true,
    },
  },
};

interface VerifyPasswordAndDeleteProfileProps {
  setDeletionConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const VerifyPasswordAndDeleteProfile = ({ setDeletionConfirmed, setError }: VerifyPasswordAndDeleteProfileProps) => {
  const dispatch = useAppDispatch();

  const onSubmit = async (values: PasswordValidationValuesType) => {
    const errorMessage = await dispatch(authSliceDeleteUser(values.password));

    if (!errorMessage) {
      setError('');
      setDeletionConfirmed(false);
    } else {
      setError(errorMessage);
    }
  };

  const onCancel = () => {
    setError('');
    setDeletionConfirmed(false);
  };

  return (
    <View>
      <StyledText variant="title">Are you sure you want to delete your profile</StyledText>
      <StyledText>This action is permanent. Enter your password below to confirm that you really want to delete your profile</StyledText>
      <Form<PasswordValidationValuesType>
        formFields={formFields}
        onSubmit={onSubmit}
        submitLabel="Confirm profile deletion"
        validationSchema={validationSchema}
      />
      <Button onPress={onCancel}>Cancel</Button>
    </View>
  );
};

const DangerZone = () => {
  const theme = useTheme<AppTheme>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletionConfirmend, setDeletionConfirmed] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleDeleteCb = (deletionConfirmation: boolean) => {
    setDeletionConfirmed(deletionConfirmation);
  };

  const onOpenClosePress = () => {
    if (isOpen) {
      setError('');
      setDeletionConfirmed(false);
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const onDeletePress = () => {
    askConfirmation(
      'Are you sure you want to delete your profile?',
      handleDeleteCb
    );
  };

  return (
    <View style={theme.styles.errorContainer}>
      <StyledText variant={isOpen ? 'headline' : 'title'}>Danger zone</StyledText>
      {isOpen && <>
        <ErrorRenderer>{error}</ErrorRenderer>
        {deletionConfirmend
          ? <VerifyPasswordAndDeleteProfile
              setDeletionConfirmed={setDeletionConfirmed}
              setError={setError}
            />
          : <Button
              colors={[theme.colors.onErrorContainer, theme.colors.errorContainer]}
              onPress={onDeletePress}
            >
              I want to delete my profile
            </Button>
        }
      </>
      }
      <Button
        colors={isOpen
          ? undefined
          : [theme.colors.onErrorContainer, theme.colors.errorContainer]
        }
        onPress={onOpenClosePress}
      >
        {isOpen ? "Close danger zone" : "Open danger zone"}
      </Button>
    </View>
  );
};

const SignedInView = () => {
  const theme = useTheme<AppTheme>();
  const { user, isInitialized, loading, error } = useAppSelector(SelectAuth);

  if (!isInitialized || loading || error) {
    return (
      <View>
        <LoadingOrErrorRenderer
          loading={loading || !isInitialized}
          loadingMessage={isInitialized ? 'Just a moment, we are loading the profile for you' : ''}
          error={error}
        />
      </View>
    );
  }

  if (!user) {
    return (
      <View>
        <StyledText variant="headline">Profile</StyledText>
        <StyledText>Something went wrong while loading your profile. Please try again, or contact our support team if the problem persist</StyledText>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
      <StyledText variant="headline">{user.displayName}</StyledText>
      <View style={theme.styles.table}>
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Email</StyledText>
          <StyledText style={theme.styles.tableCellData}>{user.email}</StyledText>
        </View>
        <View style={theme.styles.tableRow}>
          <StyledText variant="title" style={theme.styles.tableCellData}>Previous login</StyledText>
          <StyledText style={theme.styles.tableCellData}>{user.lastseenAt ? user.lastseenAt.toLocaleString() : "First time here, welcome!"}</StyledText>
        </View>
      </View>
      <Button onPress={theme.toggleScheme}>
        {theme.dark ? "Toggle light theme" : "Toggle dark theme"}
      </Button>
      <Button onPress={firebase.signOut as (e?: GestureResponderEvent) => void}>
        Sign Out
      </Button>
      <Separator height={20} />
      <DangerZone />
    </ScrollView>
  );
};

export default SignedInView;
