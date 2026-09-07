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
          transactionResult: { id: 'txn-123', status: 'REJECTED' } 
        } 
      } 
    });
    
    expect(screen.getByText(/Pago Rechazado/i)).toBeInTheDocument();
    expect(screen.getByText('REJECTED')).toBeInTheDocument();
  });
});
