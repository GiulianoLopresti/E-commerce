import { Link } from 'react-router-dom';
import type { UserProps } from '../../../interfaces'; // Asegúrate que tu index de interfaces exporte 'User'
import styles from "./navBar.module.css";

interface UserActionsProps {
  currentUser: UserProps | null;
  cartItemCount: number;
  onLogout: () => void;
}

export const UserActions = ({ currentUser, cartItemCount, onLogout }: UserActionsProps) => {
  return (
    <div className={styles.userActions}>
      
      {currentUser ? (
        <div className={styles.accountMenu}>
          <Link to="/mi-cuenta" className={styles.actionLink}>
            Bienvenido, {currentUser.name}
          </Link>
          <button onClick={onLogout} className={styles.logoutButton}>
            (Salir)
          </button>
        </div>
      ) : (
        <Link to="/login" className={styles.actionLink}>
          Mi Cuenta
        </Link>
      )}

      <Link to="/carrito" className={`${styles.actionLink} ${styles.cartLink}`}>
        Carrito
        {cartItemCount > 0 && (
          <span className={styles.cartCount}>{cartItemCount}</span>
        )}
      </Link>
    </div>
  );
};