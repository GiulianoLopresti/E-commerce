import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductGrid } from '../components/common/product/ProductGrid';
import { getProducts, searchProducts } from '../actions/products.actions';
import { getCategories } from '../actions/categories.actions';
import type { ProductProps, CategoryProps, UserProps } from '../interfaces';
import styles from '../style/pages.module.css';

interface HomePageProps {
  onAddToCart: (productId: number, quantity?: number) => void;
  currentUser?: UserProps | null;
  searchQuery?: string;
}

export const HomePage = ({ onAddToCart, currentUser, searchQuery }: HomePageProps) => {
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

  // Manejar búsqueda del navbar
  useEffect(() => {
    if (searchQuery?.trim()) {
      performSearch(searchQuery);
    }
  }, [searchQuery]);

  // Manejar búsqueda desde URL al cargar la página
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam?.trim()) {
      performSearch(searchParam);
    }
  }, []); // Solo al montar

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

  // Función para realizar búsqueda en el backend
  const performSearch = async (query: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await searchProducts(query);
      
      if (response.ok) {
        setFilteredProducts(response.products);
        setSelectedCategory(null);
        
        // Actualizar URL con parámetro de búsqueda
        const newParams = new URLSearchParams();
        newParams.set('search', query);
        setSearchParams(newParams);
      } else {
        setError('Error al buscar productos');
      }
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setError('Error al buscar productos');
    } finally {
      setLoading(false);
    }
  };

  // Manejar filtrado por categoría desde URL
  useEffect(() => {
    const categoryParam = searchParams.get('categoria');
    const searchParam = searchParams.get('search');

    // Si hay búsqueda, ya se manejó en otro useEffect
    if (searchParam) {
      return;
    }

    // Si hay categoría en URL
    if (categoryParam) {
      const category = categories.find(c => c.name === categoryParam);
      if (category) {
        setSelectedCategory(category.categoryId);
        const filtered = products.filter(p => p.category.categoryId === category.categoryId);
        setFilteredProducts(filtered);
        return;
      }
    }

    // Sin filtros: mostrar todos
    if (products.length > 0) {
      setFilteredProducts(products);
      setSelectedCategory(null);
    }
  }, [searchParams, categories, products]);

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    
    const newParams: Record<string, string> = {};
    
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
                    loadData();
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
        )}
      </div>
    </div>
  );
};