import React from 'react';

import * as Yup from 'yup';
import { fireEvent, renderWithProvidersWrapped, screen, waitFor } from '../../gosagora-testing-library/react-native';

import Form from '../../../src/components/Form';

type FormValuesType = {
  username: string;
  password: string;
  email: string;
};

describe('Form component', () => {
  const validationSchema: Yup.Schema<FormValuesType> = Yup.object().shape({
    username: Yup.string()
      .min(6, 'Username must be at least 6 characters long')
      .max(30, 'Username can not be longer than 30 characters')
      .required('Username is required!'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .max(30, 'Password can not be longer than 30 characters')
      .required('Password is required!'),
    email: Yup.string()
      .email('Email must be a valid email')
      .required('Email is required!'),
  });

  const formFields = {
    username: {
      label: 'Username',
      placeholder: 'Username',
    },
    password: {
      label: 'Password',
      placeholder: 'Password',
      props: {
        secureTextEntry: true,
        testID: 'password-text-input'
      },
    },
    email: {
      label: 'Email',
      placeholder: 'Email',
    },
  };


  it('Renders all textfields and submit button with label passed as props', () => {
    const onSubmit = jest.fn();

    renderWithProvidersWrapped(<Form
      formFields={formFields}
      onSubmit={onSubmit}
      submitLabel='Submit Form'
      validationSchema={validationSchema}
    />);

    expect(screen.getByPlaceholderText('Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByText('Submit Form')).toBeTruthy();
  }); // Renders all textfields and submit button with label passed as props


  it('Renders obfuscated textfield with secureTextEntry in props', async () => {
    const password = 'my-Top-s3cr3t!PasswD';
    const onSubmit = jest.fn();

    renderWithProvidersWrapped(<Form
      formFields={formFields}
      onSubmit={onSubmit}
      submitLabel='Submit Form'
      validationSchema={validationSchema}
    />);

    fireEvent.changeText(screen.getByPlaceholderText('Password'), password);

    await waitFor(() => {
      expect(screen.getByTestId('password-text-input').props.secureTextEntry).toBe(true);
      expect(screen.getByTestId('password-text-input').props.value).toEqual(password);
    });
  }); // Renders obfuscated textfield with secureTextEntry in props


  it('Displays validation errors for unchanged fields on submit', async () => {
    const onSubmit = jest.fn();

    renderWithProvidersWrapped(<Form
      formFields={formFields}
      onSubmit={onSubmit}
      submitLabel='Submit Form'
      validationSchema={validationSchema}
    />);

    fireEvent.press(screen.getByText('Submit Form'));

    await waitFor(() => expect(screen.getByText('Username is required!')).toBeTruthy());
    await waitFor(() => expect(screen.getByText('Password is required!')).toBeTruthy());
    await waitFor(() => expect(screen.getByText('Email is required!')).toBeTruthy());
  }); // Displays validation errors for unchanged fields on submit


  it('Displays validation errors correctly', async () => {
    const onSubmit = jest.fn();
    const submitLabel = 'Submit';

    renderWithProvidersWrapped(<Form
      formFields={formFields}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
      validationSchema={validationSchema}
    />);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'usern');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'passwor');
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'notproper.mail');
    fireEvent.press(screen.getByText(submitLabel));

    await waitFor(() => expect(screen.getByText('Username must be at least 6 characters long')).toBeTruthy());
    await waitFor(() => expect(screen.getByText('Password must be at least 8 characters long')).toBeTruthy());
    await waitFor(() => expect(screen.queryByText('Email must be a valid email')).toBeTruthy());

    fireEvent.changeText(screen.getByPlaceholderText('Username'), `${'abcde'.repeat(6)}f`);
    await waitFor(() => expect(screen.getByText('Username can not be longer than 30 characters')).toBeTruthy());

    fireEvent.changeText(screen.getByPlaceholderText('Password'), `${'passw'.repeat(6)}d`);
    await waitFor(() => expect(screen.getByText('Password can not be longer than 30 characters')).toBeTruthy());

    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'proper.user@email.address.net');
    await waitFor(() => expect(screen.queryByText('Email must be a valid email')).toBeNull(), { timeout: 2000 });

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'username');
    await waitFor(() => expect(screen.queryByText('Username can not be longer than 30 characters')).toBeNull(), { timeout: 2000 });

    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'myUsersPassword');
    await waitFor(() => expect(screen.queryByText('Password can not be longer than 30 characters')).toBeNull(), { timeout: 2000 });

  }, 10000); // Displays validation errors correctly

  /* TODO:
  it('Disables submit button if validations fail', () => {
  });
  */

  it('Submits form with valid inputs', async () => {
    const username = 'GosaGoraUser';
    const password = 'TopsecreT';
    const email = 'gosagorauser.tester@test.gosagora.com';
    const submitLabel = 'Submit to complete SignIn';
    const onSubmit = jest.fn();

    renderWithProvidersWrapped(<Form
      formFields={formFields}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
      validationSchema={validationSchema}
    />);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), username);
    fireEvent.changeText(screen.getByPlaceholderText('Password'), password);
    fireEvent.changeText(screen.getByPlaceholderText('Email'), email);
    fireEvent.press(screen.getByText(submitLabel));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(onSubmit.mock.calls[0][0]).toEqual({
        username, password, email
      });
    });
  });


  it('Does not submit form when validations fail', async () => {
    const submitLabel = 'Submit to complete SignIn';
    const onSubmit = jest.fn();

    renderWithProvidersWrapped(<Form
      formFields={formFields}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
      validationSchema={validationSchema}
    />);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'short');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'pass');
    fireEvent.press(screen.getByText(submitLabel));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(0));
  }); // Does not submit form when validations fail

  /* TODO:
  it ('Disables submit button while submitting', () => {
  });
  */

}); // Form component
