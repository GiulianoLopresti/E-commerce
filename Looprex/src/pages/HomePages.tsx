import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../actions/products.actions';
import { ProductCard } from '../components/common/product/ProductCard';
import type { ProductProps } from '../interfaces';
import styles from '../style/pages.module.css';

interface HomePageProps {
  onAddToCart: (productId: number, quantity?: number) => void;
  currentUser?: any; // Agregamos currentUser para verificar si es admin
}

export const HomePage = ({ onAddToCart, currentUser }: HomePageProps) => {
  const [products, setProducts] = useState<ProductProps[]>([]);

  useEffect(() => {
    const response = getProducts();
    if (response.ok) {
      setProducts(response.products);
    }
  }, []);

  // Mostrar solo los primeros 4 productos en home
  const featuredProducts = products.slice(0, 4);

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Tienda Gamer</h1>
            <p className={styles.heroSubtitle}>
              Bienvenido a Looprex. Encuentra los mejores componentes
              y periféricos para llevar tu experiencia de juego al siguiente nivel.
            </p>
            <Link to="/productos" className={styles.heroButton}>
              Ver Catálogo <i className="fa-solid fa-arrow-right"></i>
            </Link>
            
            {/* Botón Admin - Solo visible para administradores */}
            {currentUser && currentUser.roleId === 1 && (
              <Link to="/admin" className={styles.adminButton}>
                <i className="fa-solid fa-shield-halved"></i> Panel Admin
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Productos Destacados</h2>
            <Link to="/productos" className={styles.sectionLink}>
              Ver todos <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className={styles.productsGrid}>
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.productId}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <i className="fa-solid fa-truck-fast"></i>
              <h3>Envío Rápido</h3>
              <p>Recibe tus productos en 24-48 horas</p>
            </div>
            <div className={styles.featureCard}>
              <i className="fa-solid fa-shield-check"></i>
              <h3>Compra Segura</h3>
              <p>Tus datos protegidos</p>
            </div>
            <div className={styles.featureCard}>
              <i className="fa-solid fa-headset"></i>
              <h3>Soporte 24/7</h3>
              <p>Te ayudamos cuando lo necesites</p>
            </div>
            <div className={styles.featureCard}>
              <i className="fa-solid fa-award"></i>
              <h3>Garantía de Calidad</h3>
              <p>Productos de marcas reconocidas</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};