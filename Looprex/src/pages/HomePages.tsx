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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar productos y categorías al montar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const productsResponse = await getProducts();
      if (productsResponse.ok) {
        setProducts(productsResponse.products);
        setFilteredProducts(productsResponse.products);
      } else {
        setError('Error al cargar productos');
      }

      const categoriesResponse = await getCategories();
      if (categoriesResponse.ok) {
        setCategories(categoriesResponse.categories);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Manejar parámetros de URL y filtrado
  useEffect(() => {
    const categoryParam = searchParams.get('categoria');
    const searchParam = searchParams.get('search');

    let filtered = [...products];

    // Filtrar por búsqueda
    if (searchParam) {
      const query = searchParam.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.name.toLowerCase().includes(query)
      );
    }

    // Filtrar por categoría
    if (categoryParam) {
      const category = categories.find(c => c.name === categoryParam);
      if (category) {
        setSelectedCategory(category.categoryId);
        filtered = filtered.filter(p => p.category.categoryId === category.categoryId);
      }
    } else if (!searchParam) {
      setSelectedCategory(null);
    }

    setFilteredProducts(filtered);
  }, [searchParams, categories, products]);

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    
    const newParams: Record<string, string> = {};
    
    // Mantener búsqueda si existe
    const searchParam = searchParams.get('search');
    if (searchParam) {
      newParams.search = searchParam;
    }

    // Agregar categoría
    if (categoryId !== null) {
      const category = categories.find(c => c.categoryId === categoryId);
      if (category) {
        newParams.categoria = category.name;
      }
    }

    setSearchParams(newParams);
  };

  const getCurrentTitle = () => {
    const searchParam = searchParams.get('search');
    
    if (searchParam) {
      return `Resultados para "${searchParam}"`;
    }
    
    if (selectedCategory !== null) {
      const category = categories.find(c => c.categoryId === selectedCategory);
      return category?.name || 'Productos';
    }
    
    return 'Todos los Productos';
  };

  return (
    <div className={styles.homePage}>
      {/* Banner Admin */}
      {currentUser && currentUser.role?.roleId === 1 && (
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
        {/* Mensaje de error */}
        {error && (
          <div className={styles.errorMessage}>
            <i className="fa-solid fa-circle-exclamation"></i> {error}
            <button onClick={loadData} className={styles.retryButton}>
              <i className="fa-solid fa-rotate-right"></i> Reintentar
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className={styles.loadingState}>
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>Cargando productos...</p>
          </div>
        )}

        {/* Contenido principal */}
        {!loading && !error && (
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
                  {getCurrentTitle()}
                </h1>
                <p className={styles.pageSubtitle}>
                  {filteredProducts.length} producto{filteredProducts.length === 1 ? '' : 's'} encontrado{filteredProducts.length === 1 ? '' : 's'}
                </p>
              </div>
              
              {filteredProducts.length === 0 && !loading && (
                <div className={styles.emptyState}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <h3>No se encontraron productos</h3>
                  <p>Intenta con otra búsqueda o categoría</p>
                  <button 
                    onClick={() => {
                      setSearchParams({});
                      setSelectedCategory(null);
                    }}
                    className={styles.button}
                  >
                    Ver todos los productos
                  </button>
                </div>
              )}

              {filteredProducts.length > 0 && (
                <ProductGrid 
                  products={filteredProducts}
                  onAddToCart={onAddToCart}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};