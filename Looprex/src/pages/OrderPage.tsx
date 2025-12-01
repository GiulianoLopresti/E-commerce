import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { getBuysByUserId } from '../actions/buy.actions';
import type { UserProps, BuyProps } from '../interfaces';
import styles from '../style/pages.module.css';

interface OrdersPageProps {
  currentUser: UserProps | null;
}

export const OrdersPage = ({ currentUser }: OrdersPageProps) => {
  const [buys, setBuys] = useState<BuyProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadOrders();
    }
  }, [currentUser]);

  const loadOrders = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError('');

    const response = await getBuysByUserId(currentUser.userId);
    
    if (response.ok) {
      setBuys(response.buys);
    } else {
      setError('Error al cargar tus pedidos');
    }
    
    setLoading(false);
  };

  if (!currentUser) {
  return (
    <div className={styles.container}>
      <div className={styles.errorMessage}>
        Debes iniciar sesión para ver tus pedidos
      </div>
      <Link to="/login" className={styles.button}>
        Iniciar Sesión
      </Link>
    </div>
  );
}

  const getStatusBadge = (statusId: number) => {
    const statusMap: Record<number, { label: string; className: string }> = {
      1: { label: 'Activo', className: styles.statusDelivered },
      2: { label: 'Inactivo', className: styles.statusCancelled },
      3: { label: 'Pendiente', className: styles.statusPending },
      4: { label: 'Completado', className: styles.statusDelivered },
      5: { label: 'Cancelado', className: styles.statusCancelled },
      6: { label: 'En envío', className: styles.statusShipped }
    };

    const status = statusMap[statusId] || { label: 'Desconocido', className: '' };
    return <span className={`${styles.statusBadge} ${status.className}`}>{status.label}</span>;
  };

  const formatDate = (dateString: string | number) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.ordersPage}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Mis Pedidos</h1>
          <Link to="/mi-cuenta" className={styles.backLink}>
            <i className="fa-solid fa-arrow-left"></i>
            Volver a Mi Cuenta
          </Link>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <i className="fa-solid fa-circle-exclamation"></i> {error}
            <button onClick={loadOrders} className={styles.retryButton}>
              <i className="fa-solid fa-rotate-right"></i> Reintentar
            </button>
          </div>
        )}

        {loading && (
          <div className={styles.loadingState}>
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>Cargando tus pedidos...</p>
          </div>
        )}

        {!loading && !error && buys.length === 0 && (
          <div className={styles.emptyState}>
            <i className="fa-solid fa-box-open"></i>
            <h3>No tienes pedidos aún</h3>
            <p>Cuando realices un pedido, aparecerá aquí</p>
            <Link to="/" className={styles.button}>
              Ver Productos
            </Link>
          </div>
        )}

        {!loading && !error && buys.length > 0 && (
          <div className={styles.ordersList}>
            {buys.map(buy => (
              <div key={buy.buyId} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <h3 className={styles.orderNumber}>
                      Pedido #LPX-{buy.buyId?.toString().padStart(5, '0') || '00000'}
                    </h3>
                    <p className={styles.orderDate}>
                      {formatDate(buy.buyDate)}
                    </p>
                  </div>
                  {getStatusBadge(buy.statusId)}
                </div>

                <div className={styles.orderBody}>
                  <div className={styles.orderItemsCount}>
                    <i className="fa-solid fa-location-dot"></i>
                    Método de pago: {buy.paymentMethod}
                  </div>

                  <div className={styles.orderTotal}>
                    <span>Total:</span>
                    <span className={styles.orderTotalAmount}>
                      ${buy.total.toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};