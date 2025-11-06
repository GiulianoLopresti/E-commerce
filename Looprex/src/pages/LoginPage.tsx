import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { LoginCredentials } from '../actions/user.actions';
import styles from '../style/pages.module.css';

interface LoginPageProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onLogin(credentials);
      navigate('/mi-cuenta');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.container}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Iniciar Sesión</h1>

          {error && (
            <div className={styles.errorMessage}>
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>{' '}
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i>{' '}
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <p className={styles.authFooter}>
            ¿No tienes una cuenta?{' '}
            <Link to="/registro">Crear una cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  );
};