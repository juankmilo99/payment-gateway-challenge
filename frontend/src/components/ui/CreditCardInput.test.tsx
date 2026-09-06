import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { CreditCardInput } from './CreditCardInput';
import React from 'react';

describe('CreditCardInput', () => {
  it('detects visa correctly', () => {
    renderWithProviders(<CreditCardInput placeholder="Card" />);
    const input = screen.getByPlaceholderText('Card');
    
    fireEvent.change(input, { target: { value: '4111222233334444' } });
    expect(screen.getByText('VISA')).toBeInTheDocument();
  });

  it('detects mastercard correctly', () => {
    renderWithProviders(<CreditCardInput placeholder="Card" />);
    const input = screen.getByPlaceholderText('Card');
    
    fireEvent.change(input, { target: { value: '5555222233334444' } });
    // Mastercard logo uses classes rather than text, so we check for the container
    // or just assume if VISA is not there and value is 55, it's correct.
    expect(screen.queryByText('VISA')).not.toBeInTheDocument();
    expect(document.querySelector('.bg-red-500')).toBeInTheDocument(); // Logo red circle
  });
});
