import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../style/pages.module.css';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onLogin(email, password);
      navigate('/');
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>{}
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i>{}
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className={styles.authLinks}>
            <Link to="/recuperar-contrasena" className={styles.forgotPassword}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <p className={styles.authFooter}>
            ¿No tienes una cuenta?{' '}
            <Link to="/registro">Crear una cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  );
};