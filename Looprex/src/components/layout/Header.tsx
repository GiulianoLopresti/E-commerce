import { useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/Header.module.css';

interface HeaderProps {
  currentUser: any;
  onLogout: () => void;
}

const Header = ({ currentUser, onLogout }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className="container">
          <div className={styles.topBarContent}>
            <Link to="/" className={styles.logo}>
              <i className="fas fa-store"></i>{' '}
              Looprex
            </Link>

            <form className={styles.searchBar} onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                <i className="fas fa-search"></i>
              </button>
            </form>

            <div className={styles.topBarIcons}>
              {currentUser ? (
                <>
                  <Link to="/mi-cuenta" className={styles.iconLink}>
                    <i className="fas fa-user"></i>
                    <span>Mi Cuenta</span>
                  </Link>
                  <button 
                    onClick={onLogout} 
                    className={styles.iconLink} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Salir</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className={styles.iconLink}>
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Ingresar</span>
                </Link>
              )}
              <Link to="/seguimiento" className={styles.iconLink}>
                <i className="fas fa-truck"></i>
                <span>Seguimiento</span>
              </Link>
              <Link to="/carrito" className={styles.iconLink}>
                <i className="fas fa-shopping-cart"></i>
                <span>Carrito</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;