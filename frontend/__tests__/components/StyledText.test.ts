import { render, screen } from '@testing-library/react-native';

import StyledText from '../../src/components/StyledText';

describe('StyledText', () => {

  it('Renders the text passed as children props', () => {
    const textToRender = 'Hello tests!';
    render(<StyledText>{textToRender}</StyledText>);
    screen.debug();
    expect(screen.getByText(textToRender)).toBeDefined();
  });

}); // StyledText
