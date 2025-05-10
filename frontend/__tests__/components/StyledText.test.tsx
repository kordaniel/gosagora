import React from 'react';

import { renderWithProvidersWrapped, screen } from '../gosagora-testing-library/react-native';

import StyledText from '../../src/components/StyledText';

describe('StyledText', () => {

  it(`Renders the text passed as children props`, () => {
    const textToRender = 'Hello tests!';
    renderWithProvidersWrapped(<StyledText>{textToRender}</StyledText>);

    expect(screen.getByText(textToRender)).toBeDefined();
  });

}); // StyledText
