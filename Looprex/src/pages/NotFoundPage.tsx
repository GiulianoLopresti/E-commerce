import { Link } from 'react-router-dom';
import styles from '../style/pages.module.css';

export const NotFoundPage = () => {
  return (
    <div className={styles.notFoundPage}>
      <div className={styles.container}>
        <div className={styles.notFoundContent}>
          <div className={styles.notFoundIcon}>
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          
          <h1 className={styles.notFoundTitle}>404</h1>
          <h2 className={styles.notFoundSubtitle}>Página no encontrada</h2>
          
          <p className={styles.notFoundText}>
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>

          <div className={styles.notFoundActions}>
            <Link to="/" className={styles.button}>
              <i className="fa-solid fa-house"></i>{' '}
              Volver al Inicio
            </Link>
            <Link to="/" className={styles.buttonSecondary}>
              <i className="fa-solid fa-cart-shopping"></i>{' '}
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};