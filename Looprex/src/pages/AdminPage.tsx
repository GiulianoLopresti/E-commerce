import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ProductsAdmin } from '../components/common/admin/ProductsAdmin';
import { UsersAdmin } from '../components/common/admin/UsersAdmin';
import type { UserProps } from '../interfaces';
import styles from '../style/admin.module.css';

interface AdminPageProps {
  currentUser: UserProps | null;
}

type AdminView = 'products' | 'users';

export const AdminPage = ({ currentUser }: AdminPageProps) => {
  const [activeView, setActiveView] = useState<AdminView>('products');

  // Verificar que el usuario sea admin (roleId: 1)
  if (!currentUser || currentUser.roleId !== 1) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.container}>
        {/* Header Admin */}
        <div className={styles.adminHeader}>
          <h1 className={styles.adminTitle}>
            <i className="fa-solid fa-shield-halved"></i> Panel de Administración
          </h1>
          <p className={styles.adminWelcome}>
            Bienvenido, <strong>{currentUser.name}</strong>
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className={styles.adminTabs}>
          <button
            className={`${styles.adminTab} ${activeView === 'products' ? styles.activeTab : ''}`}
            onClick={() => setActiveView('products')}
          >
            <i className="fa-solid fa-box"></i> Productos
          </button>
          <button
            className={`${styles.adminTab} ${activeView === 'users' ? styles.activeTab : ''}`}
            onClick={() => setActiveView('users')}
          >
            <i className="fa-solid fa-users"></i> Usuarios
          </button>
        </div>

        {/* Content Area */}
        <div className={styles.adminContent}>
          {activeView === 'products' && <ProductsAdmin />}
          {activeView === 'users' && <UsersAdmin />}
        </div>
      </div>
    </div>
  );
};