import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import CheckoutPage from './CheckoutPage';
import { api } from '../services/api';
import React from 'react';

vi.mock('../services/api');

describe('CheckoutPage', () => {
  const preloadedState = {
    checkout: {
      productId: '1',
      productName: 'Test Product',
      productPrice: 1000,
      customer: { email: '', fullName: '', phone: '' },
      delivery: { address: '', city: '', region: '', zipCode: '' },
      payment: { cardNumber: '', expMonth: '', expYear: '', cvc: '', cardHolder: '' },
      transactionResult: null
    }
  };

  it('redirects if no productId in state', () => {
    renderWithProviders(<CheckoutPage />, { preloadedState: { checkout: { productId: null } } });
    expect(screen.queryByText('Completa tu compra')).not.toBeInTheDocument();
  });

  it('renders checkout form and can submit', async () => {
    (api.post as any).mockResolvedValue({ data: { id: 'txn-1', status: 'APPROVED' } });
    
    renderWithProviders(<CheckoutPage />, { preloadedState });
    
    // Check it renders
    expect(screen.getByText('Completa tu compra')).toBeInTheDocument();
    
    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText('juan@ejemplo.com'), { target: { value: 'test@test.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('Ej. Juan Pérez'), { target: { value: 'Juan', name: 'fullName' } });
    fireEvent.change(screen.getByPlaceholderText('Calle 123 #45-67'), { target: { value: 'Calle', name: 'address' } });
    fireEvent.change(screen.getByPlaceholderText('Bogotá'), { target: { value: 'Bogota', name: 'city' } });
    fireEvent.change(screen.getByPlaceholderText('Como aparece en la tarjeta'), { target: { value: 'Juan', name: 'cardHolder' } });
    fireEvent.change(screen.getByPlaceholderText('MM'), { target: { value: '12', name: 'expMonth' } });
    fireEvent.change(screen.getByPlaceholderText('YY'), { target: { value: '25', name: 'expYear' } });
    fireEvent.change(screen.getByPlaceholderText('123'), { target: { value: '123', name: 'cvc' } });
    
    // Fix CreditCardInput query
    const cardInputs = document.querySelectorAll('.form-input');
    const ccInput = cardInputs[cardInputs.length - 4]; // Rough hack for the test
    if (ccInput) {
       fireEvent.change(ccInput, { target: { value: '4111111111111', name: 'cardNumber' } });
    }

    const form = document.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }

    // Summary should appear
    expect(screen.getByText('Resumen de Pago')).toBeInTheDocument();

    // Confirm Payment
    const confirmBtn = screen.getByText('Confirmar Pago');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });
});
