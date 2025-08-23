import React, { forwardRef, useImperativeHandle, useState } from 'react';

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

export type ModalCloseHandleType = {
  hideModal: () => void;
};

interface ModalProps {
  children: RNPModalProps['children'];
  title?: string;
  closeButtonLabel?: string;
  openButtonLabel: string;
  onShowModal?: () => void;
}

const Modal = forwardRef<ModalCloseHandleType, ModalProps>(function Modal(
  { children, title, openButtonLabel, closeButtonLabel = 'Cancel', onShowModal }: ModalProps,
  ref?
) {
  const theme = useTheme<AppTheme>();
  const [visible, setVisible] = useState<boolean>(false);

  const showModal = () => {
    if (onShowModal) {
      onShowModal();
    }
    setVisible(true);
  };
  const hideModal = () => setVisible(false);

  useImperativeHandle(ref, () => ({ hideModal }));

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
});

export default Modal;
