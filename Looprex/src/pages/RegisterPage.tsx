import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../actions/user.actions';
import styles from '../style/pages.module.css';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    rut: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validación de longitud de contraseña
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser({
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        rut: formData.rut,
      });

      if (response.ok) {
        alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
        navigate('/login');
      } else {
        setError(response.message || 'Error al crear la cuenta');
      }
    } catch (err: any) {
      setError('Error de conexión con el servidor');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.container}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Crear una Cuenta</h1>

          {error && (
            <div className={styles.errorMessage}>
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Juan"
                  autoComplete="given-name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastname">Apellido</label>
                <input
                  id="lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                  required
                  placeholder="Pérez"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="rut">RUT</label>
                <input
                  id="rut"
                  type="text"
                  value={formData.rut}
                  onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                  required
                  placeholder="12345678-9"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Teléfono</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="+56 9 1234 5678"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="••••••••"
                autoComplete="new-password"
                minLength={6}
              />
              <small className={styles.formHint}>Mínimo 6 caracteres</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                placeholder="••••••••"
                autoComplete="new-password"
                minLength={6}
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
                  Creando cuenta...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-plus"></i>{}
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          <p className={styles.authFooter}>
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};