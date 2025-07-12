import React, { useState } from 'react';

import {
  Portal,
  Modal as RNPModal,
  ModalProps as RNPModalProps,
  useTheme
} from 'react-native-paper';
import { ScrollView } from 'react-native';

import Button from '../Button';
import StyledText from '../StyledText';

import { AppTheme } from 'src/types';

interface ModalProps {
  children: RNPModalProps['children'];
  title?: string;
  closeButtonLabel?: string;
  openButtonLabel: string;
}

const Modal = ({ children, title, openButtonLabel, closeButtonLabel = 'Cancel' }: ModalProps) => {
  const theme = useTheme<AppTheme>();
  const [visible, setVisible] = useState<boolean>(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <>
      <Portal>
        <RNPModal
          contentContainerStyle={theme.styles.modalContainer}
          visible={visible}
          onDismiss={hideModal}
        >
          <ScrollView contentContainerStyle={theme.styles.modalContentContainer}>
            {title && <StyledText variant="title">{title}</StyledText>}
            {children}
            <Button style={{ alignSelf: "stretch" }} onPress={hideModal}>
              {closeButtonLabel}
            </Button>
          </ScrollView>
        </RNPModal>
      </Portal>
      <Button onPress={showModal}>
        {openButtonLabel}
      </Button>
    </>
  );
};

export default Modal;
