import { Link } from 'react-router-dom';
import styles from '../../style/layout.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          {/* Brand Column */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Looprex</h3>
            <p className={styles.footerDescription}>
              Tu tienda de confianza para componentes y periféricos gamer. 
              Llevamos tu experiencia de juego al siguiente nivel.
            </p>
            <div className={styles.footerContact}>
              <p>
                <i className="fa-solid fa-envelope"></i>{' '}
                contacto@looprex.cl
              </p>
              <p>
                <i className="fa-brands fa-whatsapp"></i>{' '}
                +56 9 1234 5678
              </p>
            </div>
          </div>

          {/* Links Column */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerSubtitle}>Enlaces</h4>
            <ul className={styles.footerLinks}>
              <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
              <li><Link to="/politicas-envio">Políticas de Envío</Link></li>
              <li><Link to="/terminos-condiciones">Términos y Condiciones</Link></li>
              <li><Link to="/preguntas-frecuentes">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerSubtitle}>¡Suscríbete para recibir las mejores ofertas!</h4>
            <div className={styles.newsletter}>
              <input 
                type="email" 
                placeholder="Tu email"
                className={styles.newsletterInput}
              />
              <button className={styles.newsletterButton}>
                Suscribirme
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.footerBottom}>
          <p>&copy; 2025 Looprex. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};