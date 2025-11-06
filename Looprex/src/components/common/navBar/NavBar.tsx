import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { UserActions } from './UserActions';
import type { UserProps } from '../../../interfaces';
import styles from './Style.navBar.css.module.css';

// Estas son las props que vienen del "Cerebro" (ECommerceApp)
interface NavBarProps {
  currentUser: UserProps | null;
  cartItemCount: number;
  onLogout: () => void;
}

export const NavBar = ({ currentUser, cartItemCount, onLogout }: NavBarProps) => {
    
    return (
    <div className={styles.navContainer}>
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <Logo />
        </div>
        <div className={styles.searchWrapper}>
          <SearchBar />
        </div>
        <div className={styles.actionsWrapper}>
          <UserActions 
            currentUser={currentUser} 
            cartItemCount={cartItemCount} 
            onLogout={onLogout} 
          />
        </div>
      </div>
    </div>
  );
};