import { Link } from 'react-router-dom';
import styles from "./style.navBar.css.module.css";

export const Logo = () => {
  return (
    <Link to="/" className={styles.logo}>
      Looprex
      {<img src="/assets/Logo.PNG" alt="Looprex Logo" className={styles.logoImage} />}
    </Link>
  );
};