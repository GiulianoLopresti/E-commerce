import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuantitySelector } from '@/components/common/product/Quantityselector';

describe('QuantitySelector', () => {
  it('debería mostrar la cantidad inicial', () => {
    render(<QuantitySelector quantity={5} onChange={vi.fn()} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(5);
  });

  it('debería incrementar la cantidad', () => {
    const handleChange = vi.fn();
    render(<QuantitySelector quantity={5} onChange={handleChange} max={10} />);
    
    const incrementButton = screen.getByRole('button', { name: /plus/i });
    fireEvent.click(incrementButton);
    
    expect(handleChange).toHaveBeenCalledWith(6);
  });

  it('debería decrementar la cantidad', () => {
    const handleChange = vi.fn();
    render(<QuantitySelector quantity={5} onChange={handleChange} min={1} />);
    
    const decrementButton = screen.getByRole('button', { name: /minus/i });
    fireEvent.click(decrementButton);
    
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it('no debería exceder el máximo', () => {
    const handleChange = vi.fn();
    render(<QuantitySelector quantity={10} onChange={handleChange} max={10} />);
    
    const incrementButton = screen.getByRole('button', { name: /plus/i });
    expect(incrementButton).toBeDisabled();
  });

  it('no debería ir por debajo del mínimo', () => {
    const handleChange = vi.fn();
    render(<QuantitySelector quantity={1} onChange={handleChange} min={1} />);
    
    const decrementButton = screen.getByRole('button', { name: /minus/i });
    expect(decrementButton).toBeDisabled();
  });
});