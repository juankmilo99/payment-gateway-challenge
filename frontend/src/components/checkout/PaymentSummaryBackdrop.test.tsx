import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { PaymentSummaryBackdrop } from './PaymentSummaryBackdrop';
import React from 'react';

describe('PaymentSummaryBackdrop', () => {
  it('renders summary details correctly', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    
    renderWithProviders(
      <PaymentSummaryBackdrop 
        productName="Test" 
        productPrice={1000} 
        baseFee={200} 
        deliveryFee={100} 
        isLoading={false} 
        onConfirm={onConfirm} 
        onCancel={onCancel} 
      />
    );
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('$2.00')).toBeInTheDocument();
    expect(screen.getByText('$1.00')).toBeInTheDocument();
    expect(screen.getByText('$13.00')).toBeInTheDocument(); // total
  });

  it('calls onConfirm when button clicked', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    
    renderWithProviders(
      <PaymentSummaryBackdrop 
        productName="Test" productPrice={1000} baseFee={200} deliveryFee={100} isLoading={false} 
        onConfirm={onConfirm} onCancel={onCancel} 
      />
    );
    
    fireEvent.click(screen.getByText('Confirmar Pago'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('shows spinner when loading', () => {
    renderWithProviders(
      <PaymentSummaryBackdrop 
        productName="Test" productPrice={1000} baseFee={200} deliveryFee={100} isLoading={true} 
        onConfirm={jest.fn()} onCancel={jest.fn()} 
      />
    );
    
    expect(screen.getByText('Procesando pago...')).toBeInTheDocument();
    expect(screen.queryByText('Confirmar Pago')).not.toBeInTheDocument();
  });
});
