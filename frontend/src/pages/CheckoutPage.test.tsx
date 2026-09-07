// Jest provides describe, it, expect, jest globally
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import CheckoutPage from './CheckoutPage';
import { api } from '../services/api';
import React from 'react';

jest.mock('../services/api');
jest.mock('lucide-react', () => ({
  ChevronLeft: () => 'ChevronLeft',
  CreditCard: () => 'CreditCard',
  Loader2: () => 'Loader2'
}));

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
    fireEvent.change(screen.getByPlaceholderText('+57 300 000 0000'), { target: { value: '3000000000', name: 'phone' } });
    fireEvent.change(screen.getByPlaceholderText('Calle 123 #45-67'), { target: { value: 'Calle', name: 'address' } });
    fireEvent.change(screen.getByPlaceholderText('Bogotá'), { target: { value: 'Bogota', name: 'city' } });
    fireEvent.change(screen.getByPlaceholderText('Como aparece en la tarjeta'), { target: { value: 'Juan', name: 'cardHolder' } });
    fireEvent.change(screen.getByPlaceholderText('MM'), { target: { value: '12', name: 'expMonth' } });
    fireEvent.change(screen.getByPlaceholderText('YY'), { target: { value: '30', name: 'expYear' } });
    fireEvent.change(screen.getByPlaceholderText('123'), { target: { value: '123', name: 'cvc' } });
    
    // Fix CreditCardInput query
    const cardInputs = document.querySelectorAll('.form-input');
    const ccInput = cardInputs[cardInputs.length - 4]; // Rough hack for the test
    if (ccInput) {
       fireEvent.change(ccInput, { target: { value: '4111111111111111', name: 'cardNumber' } });
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

  it('handles field validations and edge cases', async () => {
    renderWithProviders(<CheckoutPage />, { preloadedState });
    
    // 0. Submit empty form
    const form = document.querySelector('form');
    if (form) fireEvent.submit(form);
    expect(screen.getByText(/completa todos los campos/i)).toBeInTheDocument();

    // Fill required fields to pass the empty check
    fireEvent.change(screen.getByPlaceholderText('juan@ejemplo.com'), { target: { value: 'test@test.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('Ej. Juan Pérez'), { target: { value: 'Juan', name: 'fullName' } });
    fireEvent.change(screen.getByPlaceholderText('Calle 123 #45-67'), { target: { value: 'Calle', name: 'address' } });
    fireEvent.change(screen.getByPlaceholderText('Bogotá'), { target: { value: 'Bogota', name: 'city' } });
    fireEvent.change(screen.getByPlaceholderText('Como aparece en la tarjeta'), { target: { value: 'Juan', name: 'cardHolder' } });
    fireEvent.change(screen.getByPlaceholderText('0000 0000 0000 0000'), { target: { value: '4111111111111111', name: 'cardNumber' } });
    fireEvent.change(screen.getByPlaceholderText('123'), { target: { value: '123', name: 'cvc' } });

    // 1. Phone validation (filter letters)
    const phoneInput = screen.getByPlaceholderText('+57 300 000 0000');
    fireEvent.change(phoneInput, { target: { value: '123abc456', name: 'phone' } });
    
    // 2. Region input
    const regionInput = screen.getByPlaceholderText('Cundinamarca');
    fireEvent.change(regionInput, { target: { value: 'Antioquia', name: 'region' } });

    // 3. Invalid month
    const monthInput = screen.getByPlaceholderText('MM');
    fireEvent.change(monthInput, { target: { value: '13', name: 'expMonth' } });

    // 4. Invalid year
    const yearInput = screen.getByPlaceholderText('YY');
    fireEvent.change(yearInput, { target: { value: '1', name: 'expYear' } });

    // 5. Expired date
    fireEvent.change(monthInput, { target: { value: '01', name: 'expMonth' } });
    fireEvent.change(yearInput, { target: { value: '20', name: 'expYear' } });

    // 6. Submit with errors
    if (form) fireEvent.submit(form);
    expect(screen.getByText(/corrige los errores/i)).toBeInTheDocument();

    // 7. Back button
    const backBtn = screen.getByText(/Volver a productos/i);
    fireEvent.click(backBtn);
  });
});
