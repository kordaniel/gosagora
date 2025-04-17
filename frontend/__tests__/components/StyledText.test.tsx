import React from 'react';

import { render, screen } from '@testing-library/react-native';

import StyledText from '../../src/components/StyledText';

describe('StyledText', () => {

  it(`Renders the text passed as children props`, () => {
    const textToRender = 'Hello tests!';
    render(<StyledText>{textToRender}</StyledText>);

    expect(screen.getByText(textToRender)).toBeDefined();
  });

}); // StyledText
