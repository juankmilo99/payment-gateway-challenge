import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { PaymentSummaryBackdrop } from './PaymentSummaryBackdrop';
import React from 'react';

describe('PaymentSummaryBackdrop', () => {
  it('renders summary details correctly', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
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
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
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
        onConfirm={vi.fn()} onCancel={vi.fn()} 
      />
    );
    
    expect(screen.getByText('Procesando pago...')).toBeInTheDocument();
    expect(screen.queryByText('Confirmar Pago')).not.toBeInTheDocument();
  });
});
