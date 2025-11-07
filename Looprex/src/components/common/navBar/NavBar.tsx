import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { UserActions } from './UserActions';
import type { UserProps } from '../../../interfaces';
import styles from './Style.navBar.module.css';

interface NavBarProps {
  currentUser: UserProps | null;
  cartItemCount: number;
  onLogout: () => void;
  onSearch: (query: string) => void;
}

export const NavBar = ({ currentUser, cartItemCount, onLogout, onSearch }: NavBarProps) => {
  return (
    <div className={styles.navContainer}>
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <Logo />
        </div>
        <div className={styles.searchWrapper}>
          <SearchBar onSearch={onSearch} />
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