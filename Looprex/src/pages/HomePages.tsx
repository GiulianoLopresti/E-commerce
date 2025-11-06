import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductGrid } from '../components/common/product/ProductGrid';
import { getProducts } from '../actions/products.actions';
import { getCategories } from '../actions/categories.actions';
import type { ProductProps, CategoryProps } from '../interfaces';
import styles from '../style/pages.module.css';

interface HomePageProps {
  onAddToCart: (productId: number, quantity?: number) => void;
}

export const HomePage = ({ onAddToCart }: HomePageProps) => {
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
      setSelectedCategory(Number.parseInt(categoryParam));
    }
  }, [searchParams]);

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
      setSearchParams({ categoria: categoryId.toString() });
    }
  };

  return (
    <div className={styles.homePage}>
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