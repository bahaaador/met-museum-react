import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';

test('renders search input', () => {
  const { getByPlaceholderText } = render(<App />);
  const searchBox = getByPlaceholderText(/Enter keyword here/i);
  expect(searchBox).toBeInTheDocument();
  fireEvent()
});
