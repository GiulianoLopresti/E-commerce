import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getBuyById } from '../actions/buy.actions';
import { getDetailsByBuyId } from '../actions/detail.actions';
import { getProductById } from '../actions/products.actions';
import type { BuyProps, DetailProps, ProductProps } from '../interfaces';
import styles from '../style/pages.module.css';

interface DetailWithProduct extends DetailProps {
  product?: ProductProps;
}

export const DetailOrderPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [buy, setBuy] = useState<BuyProps | null>(null);
  const [details, setDetails] = useState<DetailWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('DetailOrderPage - orderId:', orderId);
    
    if (!orderId) {
      console.error('No orderId en URL');
      navigate('/');
      return;
    }

    loadOrderData();
  }, [orderId]);

  const loadOrderData = async () => {
    if (!orderId) return;
    
    setLoading(true);
    setError('');

    try {
      console.log('Cargando compra con ID:', orderId);
      
      // Cargar la compra
      const buyResponse = await getBuyById(Number(orderId));
      
      console.log('Respuesta getBuyById:', buyResponse);
      
      if (!buyResponse.ok || !buyResponse.buy) {
        setError('No se pudo cargar la información del pedido');
        setLoading(false);
        return;
      }

      setBuy(buyResponse.buy);
      console.log('Buy cargado:', buyResponse.buy);

      // Cargar detalles de la compra
      console.log('Cargando detalles...');
      const detailsResponse = await getDetailsByBuyId(Number(orderId));
      
      console.log('Respuesta getDetailsByBuyId:', detailsResponse);
      
      if (!detailsResponse.ok) {
        console.warn('No se pudieron cargar los detalles');
        setDetails([]);
        setLoading(false);
        return;
      }

      console.log('Detalles cargados:', detailsResponse.details);

      // Cargar productos para cada detalle
      const detailsWithProducts: DetailWithProduct[] = [];
      
      for (const detail of detailsResponse.details) {
        console.log('Cargando producto ID:', detail.productId);
        
        const productResponse = await getProductById(detail.productId);
        
        console.log('Producto cargado:', productResponse);
        
        detailsWithProducts.push({
          ...detail,
          product: productResponse.product || undefined
        });
      }

      console.log('Detalles con productos:', detailsWithProducts);
      setDetails(detailsWithProducts);

    } catch (err) {
      console.error('Error al cargar pedido:', err);
      setError('Error al cargar la información del pedido');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp || Number.isNaN(timestamp)) {
      return 'Fecha no disponible';
    }
    
    const date = new Date(timestamp);
    
    // Verificar si la fecha es válida
    if (Number.isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.container}>
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !buy) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          <i className="fa-solid fa-exclamation-triangle"></i>
          {error || 'No se encontró el pedido'}
        </div>
        <button onClick={() => navigate('/')} className={styles.buttonPrimary}>
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className={styles.orderConfirmationPage}>
      <div className={styles.container}>
        {/* Header de confirmación */}
        <div className={styles.confirmationHeader}>
          <div className={styles.successIcon}>
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <h1 className={styles.confirmationTitle}>¡Pedido realizado con éxito!</h1>
          <p className={styles.confirmationSubtitle}>
            Gracias por tu compra. Tu pedido ha sido registrado correctamente.
          </p>
        </div>

        {/* Información del pedido */}
        <div className={styles.orderInfoCard}>
          <h2 className={styles.sectionTitle}>Información del Pedido</h2>
          
          <div className={styles.orderInfoGrid}>
            <div className={styles.orderInfoItem}>
                <span className={styles.orderInfoLabel}>Número de Orden:</span>
                <span className={styles.orderInfoValue}>{buy.orderNumber || 'N/A'}</span>
            </div>
            
            <div className={styles.orderInfoItem}>
                <span className={styles.orderInfoLabel}>Fecha:</span>
                <span className={styles.orderInfoValue}>
                {buy.buyDate ? formatDate(buy.buyDate) : 'Fecha no disponible'}
                </span>
            </div>
            
            <div className={styles.orderInfoItem}>
                <span className={styles.orderInfoLabel}>Método de Pago:</span>
                <span className={styles.orderInfoValue}>{buy.paymentMethod || 'N/A'}</span>
            </div>
            
            <div className={styles.orderInfoItem}>
              <span className={styles.orderInfoLabel}>Estado:</span>
              <span className={`${styles.orderInfoValue} ${styles.statusBadge}`}>
                Pendiente
              </span>
            </div>
          </div>
        </div>

        {/* Productos del pedido */}
        {details.length > 0 && (
          <div className={styles.orderItemsCard}>
            <h2 className={styles.sectionTitle}>Productos</h2>
            
            <div className={styles.orderItemsList}>
              {details.map((detail) => (
                <div key={detail.detailId} className={styles.orderItem}>
                  {detail.product && (
                    <img 
                      src={detail.product.productPhoto} 
                      alt={detail.product.name}
                      className={styles.orderItemImage}
                    />
                  )}
                  
                  <div className={styles.orderItemInfo}>
                    <h3 className={styles.orderItemName}>
                      {detail.product?.name || 'Producto'}
                    </h3>
                    <p className={styles.orderItemDetails}>
                      Cantidad: {detail.quantity} × ${detail.unitPrice.toLocaleString('es-CL')}
                    </p>
                  </div>
                  
                  <div className={styles.orderItemTotal}>
                    ${detail.subtotal.toLocaleString('es-CL')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumen de totales */}
        <div className={styles.orderTotalsCard}>
          <h2 className={styles.sectionTitle}>Resumen</h2>
          
          <div className={styles.orderTotals}>
            <div className={styles.orderTotalRow}>
              <span>Subtotal</span>
              <span>${buy.subtotal.toLocaleString('es-CL')}</span>
            </div>
            
            <div className={styles.orderTotalRow}>
              <span>IVA (19%)</span>
              <span>${buy.iva.toLocaleString('es-CL')}</span>
            </div>
            
            <div className={styles.orderTotalRow}>
              <span>Envío</span>
              <span>
                {buy.shipping === 0 ? (
                  <span className={styles.freeShipping}>Gratis</span>
                ) : (
                  `$${buy.shipping.toLocaleString('es-CL')}`
                )}
              </span>
            </div>
            
            <div className={styles.orderTotalFinal}>
              <span>Total</span>
              <span>${buy.total.toLocaleString('es-CL')}</span>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className={styles.confirmationActions}>
          <button 
            onClick={() => navigate('/mis-pedidos')}
            className={styles.buttonPrimary}
          >
            <i className="fa-solid fa-list"></i>
            Ver todos mis pedidos
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className={styles.buttonSecondary}
          >
            <i className="fa-solid fa-home"></i>
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};