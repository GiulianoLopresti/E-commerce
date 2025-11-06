import { Link } from 'react-router-dom';
import { CategoryNav } from '../common/categoryNav/Category';
import type { UserProps } from '../../interfaces';
import styles from '../../style/layout.module.css';

interface HeaderProps {
  currentUser: UserProps | null;
  cartItemCount: number;
  onLogout: () => void;
}

export const Header = ({ currentUser, cartItemCount, onLogout }: HeaderProps) => {
  return (
    <header className={styles.header}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.topBarContent}>
            {/* Logo */}
            <Link to="/" className={styles.logo}>
              <i className="fa-solid fa-tower-broadcast"></i>
              <span>Looprex</span>
            </Link>

            {/* Search Bar */}
            <div className={styles.searchBar}>
              <input 
                type="text" 
                placeholder="Buscar producto..."
                className={styles.searchInput}
              />
              <button className={styles.searchButton}>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>

            {/* Actions */}
            <div className={styles.headerActions}>
              <Link to={currentUser ? "/mi-cuenta" : "/login"} className={styles.headerLink}>
                <i className="fa-solid fa-user"></i>
                <span>{currentUser ? currentUser.name : 'Mi Cuenta'}</span>
              </Link>

              <Link to="/mis-pedidos" className={styles.headerLink}>
                <i className="fa-solid fa-truck"></i>
                <span>Seguimiento</span>
              </Link>

              <Link to="/carrito" className={styles.headerLink}>
                <i className="fa-solid fa-cart-shopping"></i>
                <span>Carrito</span>
                {cartItemCount > 0 && (
                  <span className={styles.badge}>{cartItemCount}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <CategoryNav/>
    </header>
  );
};