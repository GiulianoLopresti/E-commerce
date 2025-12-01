import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../../actions/categories.actions';
import type { CategoryProps } from '../../../interfaces';
import styles from '../../../style/layout.module.css';

export const CategoryNav = () => {
  const [categories, setCategories] = useState<CategoryProps[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await getCategories();
    if (response.ok) {
      setCategories(response.categories);
    }
  };

  return (
    <nav className={styles.categoryNav}>
      <div className={styles.container}>
        <ul className={styles.categoryList}>
          <li>
            <Link to="/" className={styles.categoryLink}>
              Todas
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.categoryId}>
              <Link 
                to={`/?categoria=${encodeURIComponent(category.name)}`} 
                className={styles.categoryLink}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};