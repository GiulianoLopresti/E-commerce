import { Link } from 'react-router-dom';
import styles from "./navBar.module.css";

export const Logo = () => {
  return (
    <Link to="/" className={styles.logo}>
      Looprex
    </Link>
  );
};