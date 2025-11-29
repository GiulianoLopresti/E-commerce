import { useState, useEffect } from 'react';
import { getUsers } from '../../../actions/user.actions';
import type { UserProps } from '../../../interfaces';
import styles from '../../../style/admin.module.css';

export const UsersAdmin = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    
    const response = await getUsers();
    
    if (response.ok) {
      setUsers(response.users);
    } else {
      setError('Error al cargar usuarios');
    }
    
    setLoading(false);
  };

  const getRoleBadgeClass = (roleId: number) => {
    return roleId === 1 ? styles.badgeAdmin : styles.badgeUser;
  };

  return (
    <div className={styles.adminSection}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <i className="fa-solid fa-users"></i> Usuarios Registrados
        </h2>
        <div className={styles.statsContainer}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total Usuarios:</span>
            <span className={styles.statValue}>{users.length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Administradores:</span>
            <span className={styles.statValue}>
              {users.filter(u => u.role.roleId === 1).length}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Clientes:</span>
            <span className={styles.statValue}>
              {users.filter(u => u.role.roleId === 2).length}
            </span>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className={styles.errorMessage}>
          <i className="fa-solid fa-circle-exclamation"></i> {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className={styles.loadingState}>
          <i className="fa-solid fa-spinner fa-spin"></i> Cargando usuarios...
        </div>
      )}

      {/* Tabla de usuarios */}
      {!loading && users.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>RUT</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.rut}</td>
                  <td>{user.name} {user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`${styles.badge} ${getRoleBadgeClass(user.role.roleId)}`}>
                      {user.role.name}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {!loading && users.length === 0 && (
        <div className={styles.emptyState}>
          <i className="fa-solid fa-users-slash"></i>
          <p>No hay usuarios registrados</p>
        </div>
      )}
    </div>
  );
};