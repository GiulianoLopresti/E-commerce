import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuantitySelector } from '@/components/common/product/Quantityselector';

describe('QuantitySelector', () => {
  it('debería mostrar la cantidad inicial', () => {
    render(<QuantitySelector quantity={5} onChange={vi.fn()} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(5);
  });

  it('✓ debe incrementar la cantidad', () => {
    const handleChange = vi.fn();
    render(<QuantitySelector quantity={5} onChange={handleChange} max={10} />);
    
    const buttons = screen.getAllByRole('button');
    const incrementButton = buttons[1]; // Segundo botón (plus)
    fireEvent.click(incrementButton);
    
    expect(handleChange).toHaveBeenCalledWith(6);
  });

  it('✓ debe decrementar la cantidad', () => {
    const handleChange = vi.fn();
    render(<QuantitySelector quantity={5} onChange={handleChange} min={1} />);
    
    const buttons = screen.getAllByRole('button');
    const decrementButton = buttons[0]; // Primer botón (minus)
    fireEvent.click(decrementButton);
    
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it('✓ no debería exceder el máximo', () => {
    const handleChange = vi.fn();
    render(<QuantitySelector quantity={10} onChange={handleChange} max={10} />);
    
    const buttons = screen.getAllByRole('button');
    const incrementButton = buttons[1];
    expect(incrementButton).toBeDisabled();
  });

    it('✓ no debería ir por debajo del mínimo', () => {
      const handleChange = vi.fn();
      render(<QuantitySelector quantity={1} onChange={handleChange} min={1} />);
      
      const buttons = screen.getAllByRole('button');
      const decrementButton = buttons[0];
      expect(decrementButton).toBeDisabled();
    });
  });