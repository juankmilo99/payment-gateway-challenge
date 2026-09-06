import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Spinner } from './Spinner';
import React from 'react';

describe('Spinner component', () => {
  it('renders correctly with default props', () => {
    render(<Spinner />);
    const spinnerElement = document.querySelector('.spinner');
    expect(spinnerElement).toBeInTheDocument();
  });

  it('renders messages when provided', () => {
    render(<Spinner message="Loading..." subMessage="Please wait" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  it('applies correct class for large size', () => {
    render(<Spinner size="lg" />);
    const spinnerElement = document.querySelector('.spinner-lg');
    expect(spinnerElement).toBeInTheDocument();
  });
});
