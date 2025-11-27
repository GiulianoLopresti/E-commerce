import { useState, useEffect } from 'react';
import { getAllUsers, getRoles } from '../../../actions/user.actions';
import type { UserProps, RoleProps } from '../../../interfaces';
import styles from '../../../style/admin.module.css';

export const UsersAdmin = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [roles, setRoles] = useState<RoleProps[]>([]);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = () => {
    const response = getAllUsers();
    if (response.ok) {
      setUsers(response.users);
    }
  };

  const loadRoles = () => {
    const response = getRoles();
    if (response.ok) {
      setRoles(response.roles);
    }
  };

  const getRoleName = (roleId: number) => {
    const role = roles.find(r => r.roleId === roleId);
    return role ? role.name : 'Sin rol';
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
              {users.filter(u => u.roleId === 1).length}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Clientes:</span>
            <span className={styles.statValue}>
              {users.filter(u => u.roleId === 2).length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
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
                <td>{user.name} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <span className={`${styles.badge} ${getRoleBadgeClass(user.roleId)}`}>
                    {getRoleName(user.roleId)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className={styles.emptyState}>
          <i className="fa-solid fa-users-slash"></i>
          <p>No hay usuarios registrados</p>
        </div>
      )}
    </div>
  );
};