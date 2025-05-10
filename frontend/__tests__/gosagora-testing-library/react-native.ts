import { render } from '@testing-library/react-native';

import { AllProvidersWrapper } from './TestWrappers';

const renderWithProvidersWrapped: typeof render = (component, options) => {
  return render(component, { wrapper: AllProvidersWrapper, ...options });
};

export * from '@testing-library/react-native';
export { renderWithProvidersWrapped };
