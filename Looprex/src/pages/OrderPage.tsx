import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { getOrdersByUserId } from '../actions/order.actions';
import type { UserProps, BuyProps } from '../interfaces';
import styles from '../style/pages.module.css';

interface OrdersPageProps {
  currentUser: UserProps | null;
}

export const OrdersPage = ({ currentUser }: OrdersPageProps) => {
  const [orders, setOrders] = useState<BuyProps[]>([]);

  useEffect(() => {
    if (currentUser) {
      const response = getOrdersByUserId(currentUser.userId);
      if (response.ok) {
        setOrders(response.orders);
      }
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const getStatusBadge = (statusId: number) => {
    const statusMap: Record<number, { label: string; className: string }> = {
      1: { label: 'Pendiente', className: styles.statusPending },
      2: { label: 'Procesando', className: styles.statusProcessing },
      3: { label: 'Enviado', className: styles.statusShipped },
      4: { label: 'Entregado', className: styles.statusDelivered },
      5: { label: 'Cancelado', className: styles.statusCancelled }
    };

    const status = statusMap[statusId] || { label: 'Desconocido', className: '' };
    return <span className={`${styles.statusBadge} ${status.className}`}>{status.label}</span>;
  };

  return (
    <div className={styles.ordersPage}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Mis Pedidos</h1>
          <Link to="/mi-cuenta" className={styles.backLink}>
            <i className="fa-solid fa-arrow-left"></i> {' '}
            Volver a Mi Cuenta
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fa-solid fa-box-open"></i>
            <h3>No tienes pedidos aún</h3>
            <p>Cuando realices un pedido, aparecerá aquí</p>
            <Link to="/" className={styles.button}>
              Ver Productos
            </Link>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map(order => (
              <div key={order.orderId} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <h3 className={styles.orderNumber}>Pedido #{order.orderId}</h3>
                    <p className={styles.orderDate}>
                      {new Date(order.purchaseDate).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  {getStatusBadge(order.statusId)}
                </div>

                <div className={styles.orderBody}>
                  <div className={styles.orderItemsCount}>
                    <i className="fa-solid fa-box"></i>
                    {order.details?.length || 0} productos
                  </div>

                  <div className={styles.orderTotal}>
                    <span>Total:</span>
                    <span className={styles.orderTotalAmount}>
                      ${order.total.toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>

                <div className={styles.orderFooter}>
                  <Link 
                    to={`/pedido/${order.orderNumber}`}
                    className={styles.viewOrderButton}
                  >
                    Ver Detalles{}
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};