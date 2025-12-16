import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginPage', () => {
  const mockOnLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLoginPage = () => {
    return render(
      <BrowserRouter>
        <LoginPage onLogin={mockOnLogin} />
      </BrowserRouter>
    );
  };

  it('✓ debe renderizar el formulario de login correctamente', () => {
    renderLoginPage();

    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
  });

  it('✓ debe actualizar los campos al escribir', () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText(/Correo Electrónico/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/Contraseña/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@looprex.cl' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@looprex.cl');
    expect(passwordInput.value).toBe('password123');
  });

  it('✓ debe llamar onLogin con las credenciales correctas', async () => {
    mockOnLogin.mockResolvedValue(undefined);
    renderLoginPage();

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

    fireEvent.change(emailInput, { target: { value: 'test@looprex.cl' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('test@looprex.cl', 'password123');
    });
  });

  it('✓ debe mostrar mensaje de error cuando el login falla', async () => {
    mockOnLogin.mockRejectedValue(new Error('Credenciales incorrectas'));
    renderLoginPage();

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Credenciales incorrectas/i)).toBeInTheDocument();
    });
  });

  it('✓ debe deshabilitar el botón mientras procesa', async () => {
    mockOnLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    renderLoginPage();

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

    fireEvent.change(emailInput, { target: { value: 'test@looprex.cl' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/Iniciando sesión.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('✓ debe validar campos requeridos', async () => {
    renderLoginPage();

    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
    fireEvent.click(submitButton);

    // HTML5 validation debe prevenir el submit
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('✓ debe mostrar enlaces de navegación', () => {
    renderLoginPage();

    expect(screen.getByText(/¿Olvidaste tu contraseña?/i)).toBeInTheDocument();
    expect(screen.getByText(/Crear una cuenta/i)).toBeInTheDocument();
  });

  it('✓ debe navegar al home después de login exitoso', async () => {
    mockOnLogin.mockResolvedValue(undefined);
    renderLoginPage();

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

    fireEvent.change(emailInput, { target: { value: 'test@looprex.cl' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});