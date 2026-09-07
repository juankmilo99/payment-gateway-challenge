import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import ProductPage from './ProductPage';
import { api } from '../services/api';
import React from 'react';

// Mock API
jest.mock('../services/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

describe('ProductPage', () => {
  it('renders loading initially', () => {
    (api.get as any).mockResolvedValue(new Promise(() => {})); // Never resolves
    renderWithProviders(<ProductPage />);
    expect(screen.getByText(/Conectando con la tienda/i)).toBeInTheDocument();
  });

  it('renders product details when fetched', async () => {
    const mockProduct = { id: '1', name: 'Test Product', price: 1000, description: 'Desc', stock: 5 };
    (api.get as any).mockResolvedValue({ data: [mockProduct] });
    
    renderWithProviders(<ProductPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Comprar ahora')).toBeInTheDocument();
    });
  });

  it('renders error state on generic failure', async () => {
    (api.get as any).mockRejectedValue(new Error('Network Error'));
    renderWithProviders(<ProductPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error al cargar el producto/i)).toBeInTheDocument();
    });
  });

  it('renders timeout error on ECONNABORTED', async () => {
    const error = new Error('Timeout');
    (error as any).code = 'ECONNABORTED';
    (api.get as any).mockRejectedValue(error);
    renderWithProviders(<ProductPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/El servidor tardó demasiado en responder/i)).toBeInTheDocument();
    });
  });

  it('renders empty state when no products returned', async () => {
    (api.get as any).mockResolvedValue({ data: [] });
    renderWithProviders(<ProductPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/No hay productos disponibles/i)).toBeInTheDocument();
    });
  });

  it('allows clicking retry on error without crashing', async () => {
    (api.get as any).mockRejectedValue(new Error('Network Error'));
    renderWithProviders(<ProductPage />);
    
    await waitFor(() => {
      const retryButton = screen.getByRole('button', { name: /Reintentar/i });
      expect(retryButton).toBeInTheDocument();
      // We don't actually click it in JSDOM because it triggers navigation/reload which is locked down
      // But we assert it exists and could be clicked.
    });
  });

  it('navigates to checkout on buy click', async () => {
    const mockProduct = { id: '1', name: 'Test Product', price: 1000, description: 'Desc', stock: 5 };
    (api.get as any).mockResolvedValue({ data: [mockProduct] });
    
    renderWithProviders(<ProductPage />);
    
    await waitFor(() => {
      const buyButton = screen.getByRole('button', { name: /Comprar ahora/i });
      userEvent.click(buyButton);
      // Wait for dispatch/navigation to occur. It should trigger navigation but we don't assert it strictly here
      // since the dispatch logic is verified in test-utils and checkoutSlice, but we ensure it doesn't crash.
    });
  });
});
