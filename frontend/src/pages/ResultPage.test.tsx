// Jest provides describe, it, expect globally
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import ResultPage from './ResultPage';
import React from 'react';

describe('ResultPage', () => {
  it('redirects to home if no result in state', () => {
    renderWithProviders(<ResultPage />, { preloadedState: { checkout: { transactionResult: null } } });
    // It should render null and let router redirect (we can't easily assert Navigate here without memory router, but we ensure it renders null)
    expect(document.querySelector('.container')).not.toBeInTheDocument();
  });

  it('renders success message when approved', () => {
    renderWithProviders(<ResultPage />, { 
      preloadedState: { 
        checkout: { 
          transactionResult: { id: 'txn-123', status: 'APPROVED', providerReference: 'ref-1' } 
        } 
      } 
    });
    
    expect(screen.getByText(/Pago Exitoso/i)).toBeInTheDocument();
    expect(screen.getByText('APPROVED')).toBeInTheDocument();
  });

  it('renders error message when rejected', () => {
    renderWithProviders(<ResultPage />, { 
      preloadedState: { 
        checkout: { 
          transactionResult: { id: 'txn-123456789012345', status: 'REJECTED' } 
        } 
      } 
    });
    
    expect(screen.getByText(/Pago Rechazado/i)).toBeInTheDocument();
    expect(screen.getByText('REJECTED')).toBeInTheDocument();
  });

  it('allows copying to clipboard and truncates long ids', async () => {
    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });

    renderWithProviders(<ResultPage />, { 
      preloadedState: { 
        checkout: { 
          transactionResult: { id: 'txn-123456789012345', status: 'APPROVED', providerReference: 'provider-ref-long' } 
        } 
      } 
    });

    // Check truncation
    expect(screen.getByText('txn-1234...2345')).toBeInTheDocument();
    expect(screen.getByText('provider...long')).toBeInTheDocument();

    const copyIdBtn = screen.getAllByTitle(/Copiar ID/i)[0];
    expect(copyIdBtn).toBeInTheDocument();
    copyIdBtn.click();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('txn-123456789012345');

    // Test clicking copy reference
    const copyRefBtn = screen.getAllByTitle(/Copiar Referencia/i)[0];
    expect(copyRefBtn).toBeInTheDocument();
    copyRefBtn.click();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('provider-ref-long');

    // Test finishing flow
    const finishBtn = screen.getByText('Volver a la tienda');
    fireEvent.click(finishBtn);
  });
});
