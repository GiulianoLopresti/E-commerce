import { Link } from 'react-router-dom';
import styles from './CategoryNav.module.css';
import type { CategoryProps } from '../../../interfaces/category.interfaces';
import { toSlug } from '../../../utils/slug';

interface CategoryNavProps {
   categories: CategoryProps[];
}

export const CategoryNav = ({ categories }: CategoryNavProps) => {
  return (
    <nav className={styles.categoryNav}>
      <div className={styles.container}>
        {categories.map((category) => (
          <Link key={category.categoryId} to={`/categoria/${toSlug(category.name)}`}>
            {category.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};
export const CategoryNavStatic = () => {
  return (
    <nav className={styles.categoryNav}>
      <div className={styles.container}>
        <Link to="/categoria/componentes">Componentes PC</Link>
        <Link to="/categoria/perifericos">Periféricos Gamer</Link>
        <Link to="/categoria/monitores">Monitores</Link>
        <Link to="/categoria/consolas">Consolas</Link>
        <Link to="/categoria/equipamiento">Equipamiento</Link>
        <Link to="/categoria/notebooks">Notebooks</Link>
      </div>
    </nav>
  );
};