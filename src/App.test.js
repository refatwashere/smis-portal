// St. Mary's International School (SMIS) WEB PORTAL
// Main application component tests
// This file contains unit tests for the App component

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
