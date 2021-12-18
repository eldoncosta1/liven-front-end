import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../../pages/Home';

jest.mock('');

describe('Home Page', () => {
  it('renders correctly', () => {
    render(<Home />);
  });
});
