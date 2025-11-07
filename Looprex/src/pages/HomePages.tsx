import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductGrid } from '../components/common/product/ProductGrid';
import { getProducts } from '../actions/products.actions';
import { getCategories } from '../actions/categories.actions';
import type { ProductProps, CategoryProps, UserProps } from '../interfaces';
import styles from '../style/pages.module.css';

interface HomePageProps {
  onAddToCart: (productId: number, quantity?: number) => void;
  currentUser?: UserProps | null;
}

export const HomePage = ({ onAddToCart, currentUser }: HomePageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const productsResponse = getProducts();
    const categoriesResponse = getCategories();

    if (productsResponse.ok) {
      setProducts(productsResponse.products);
      setFilteredProducts(productsResponse.products);
    }

    if (categoriesResponse.ok) {
      setCategories(categoriesResponse.categories);
    }
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('categoria');
    if (categoryParam) {
      const category = categories.find(c => c.name === categoryParam);
      if (category) {
        setSelectedCategory(category.categoryId);
      }
    } else {
      setSelectedCategory(null);
    }
  }, [searchParams, categories]);

  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(p => p.categoryId === selectedCategory)
      );
    }
  }, [selectedCategory, products]);

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    if (categoryId === null) {
      setSearchParams({});
    } else {
      const category = categories.find(c => c.categoryId === categoryId);
      if (category) {
        setSearchParams({ categoria: category.name });
      }
    }
  };

  return (
    <div className={styles.homePage}>
      {/* ✅ BOTÓN ADMIN - Solo visible para administradores */}
      {currentUser && currentUser.roleId === 1 && (
        <div className={styles.adminBanner}>
          <div className={styles.container}>
            <Link to="/admin" className={styles.adminButton}>
              <i className="fa-solid fa-shield-halved"></i>
              <span>Acceder al Panel de Administración</span>
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      )}

      {/* Sección principal de productos */}
      <div className={styles.container}>
        <div className={styles.productsLayout}>
          {/* Sidebar de Filtros */}
          <aside className={styles.sidebar}>
            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Categorías</h3>
              <ul className={styles.filterList}>
                <li>
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className={selectedCategory === null ? styles.filterActive : ''}
                  >
                    Todas las categorías
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category.categoryId}>
                    <button
                      onClick={() => handleCategoryChange(category.categoryId)}
                      className={selectedCategory === category.categoryId ? styles.filterActive : ''}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Grid de Productos */}
          <div className={styles.productsContent}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>
                {selectedCategory === null 
                  ? 'Todos los Productos' 
                  : categories.find(c => c.categoryId === selectedCategory)?.name
                }
              </h1>
              <p className={styles.pageSubtitle}>
                {filteredProducts.length} productos encontrados
              </p>
            </div>
            
            <ProductGrid 
              products={filteredProducts}
              onAddToCart={onAddToCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};