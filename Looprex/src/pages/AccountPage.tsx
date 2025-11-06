import { Link, Navigate } from 'react-router-dom';
import type { UserProps } from '../interfaces';
import styles from '../style/pages.module.css';

interface AccountPageProps {
  currentUser: UserProps | null;
  onLogout: () => void;
}

export const AccountPage = ({ currentUser, onLogout }: AccountPageProps) => {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.accountPage}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Mi Cuenta</h1>
        </div>

        <div className={styles.accountLayout}>
          {/* Sidebar de navegación */}
          <aside className={styles.accountSidebar}>
            <div className={styles.accountMenu}>
              <Link to="/mi-cuenta" className={styles.accountMenuItemActive}>
                <i className="fa-solid fa-user"></i>{' '}
                Detalles de la cuenta
              </Link>
              <Link to="/mis-pedidos" className={styles.accountMenuItem}>
                <i className="fa-solid fa-box"></i>{' '}
                Mis Pedidos
              </Link>
              <Link to="/direcciones" className={styles.accountMenuItem}>
                <i className="fa-solid fa-location-dot"></i>{' '}
                Direcciones
              </Link>
              <button onClick={onLogout} className={styles.logoutButton}>
                <i className="fa-solid fa-right-from-bracket"></i>{' '}
                Cerrar Sesión
              </button>
            </div>
          </aside>

          {/* Contenido principal */}
          <div className={styles.accountContent}>
            <div className={styles.accountCard}>
              <h2 className={styles.accountCardTitle}>Información Personal</h2>
              
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <label htmlFor="userName">Nombre</label>
                    <p id="userName">{currentUser.name}</p>
                  </div>

                <div className={styles.infoItem}>
                  <label htmlFor="userEmail">Email</label>
                  <p id="userEmail">{currentUser.email}</p>
                </div>

                <div className={styles.infoItem}>
                  <label htmlFor="userPhone">Teléfono</label>
                  <p id="userPhone">{currentUser.phone || 'No especificado'}</p>
                </div>

                <div className={styles.infoItem}>
                  <label htmlFor="userRut">RUT</label>
                  <p id="userRut">{currentUser.rut || 'No especificado'}</p>
                </div>
              </div>

              <button className={styles.editButton}>
                <i className="fa-solid fa-pen-to-square"></i>{' '}
                Editar Información
              </button>
            </div>

            <div className={styles.accountCard}>
              <h2 className={styles.accountCardTitle}>Cambiar Contraseña</h2>
              
              <form className={styles.passwordForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="currentPassword">Contraseña Actual</label>
                  <input id="currentPassword" type="password" placeholder="••••••••" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">Nueva Contraseña</label>
                  <input id="newPassword" type="password" placeholder="••••••••" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                  <input id="confirmPassword" type="password" placeholder="••••••••" />
                </div>

                <button type="submit" className={styles.saveButton}>
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};