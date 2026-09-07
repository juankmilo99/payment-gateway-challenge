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

  it('renders error state on failure', async () => {
    (api.get as any).mockRejectedValue(new Error('Network Error'));
    renderWithProviders(<ProductPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error al cargar el producto/i)).toBeInTheDocument();
    });
  });
});
