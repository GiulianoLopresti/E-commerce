import { Link } from 'react-router-dom';
import styles from '../../../style/layout.module.css';

export const CategoryNav = () => {
  const categories = [
    { name: 'Todas', path: '/' },
    { name: 'Componentes PC', path: '/?categoria=Componentes PC' },
    { name: 'Periféricos Gamer', path: '/?categoria=Periféricos Gamer' },
    { name: 'Equipamiento y Mobiliario', path: '/?categoria=Equipamiento y Mobiliario' },
    { name: 'Computadores y Consolas', path: '/?categoria=Computadores y Consolas' }
  ];

  return (
    <nav className={styles.categoryNav}>
      <div className={styles.container}>
        <ul className={styles.categoryList}>
          {categories.map((category) => (
            <li key={category.path}>
              <Link to={category.path} className={styles.categoryLink}>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};