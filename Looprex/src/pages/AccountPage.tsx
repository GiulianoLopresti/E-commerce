import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { updateUserPersonalData, updateUserPassword } from '../actions/user.actions';
import type { UserProps } from '../interfaces';
import styles from '../style/pages.module.css';

interface AccountPageProps {
  currentUser: UserProps | null;
  onLogout: () => void;
}

export const AccountPage = ({ currentUser, onLogout }: AccountPageProps) => {
  // Estados para edición de información personal
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    lastname: currentUser?.lastname || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    rut: currentUser?.rut || ''
  });
  const [infoError, setInfoError] = useState('');
  const [infoSuccess, setInfoSuccess] = useState('');
  const [infoLoading, setInfoLoading] = useState(false);

  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Handler para guardar cambios de información personal
const handleSaveInfo = async () => {
  setInfoError('');
  setInfoSuccess('');
  setInfoLoading(true);

  // Validaciones básicas
  if (!formData.name.trim() || !formData.lastname.trim()) {
    setInfoError('Nombre y apellidos son obligatorios');
    setInfoLoading(false);
    return;
  }

  if (!formData.phone.trim()) {
    setInfoError('El teléfono es obligatorio');
    setInfoLoading(false);
    return;
  }

  try {
    // ✅ USAR updateUserPersonalData (que SÍ existe en el backend)
    const response = await updateUserPersonalData(currentUser.userId, {
      name: formData.name,
      lastname: formData.lastname,
      phone: formData.phone,
      rut: formData.rut
    });

    if (response.ok) {
      setInfoSuccess('Información actualizada exitosamente');
      setIsEditingInfo(false);
      
      // Recargar la página después de 1.5 segundos para reflejar cambios
      setTimeout(() => {
        globalThis.location.reload();
      }, 1500);
    } else {
      setInfoError(response.message || 'Error al actualizar información');
    }
  } catch (error) {
    console.error('Error updating user data:', error);
    setInfoError('Error de conexión con el servidor');
  } finally {
    setInfoLoading(false);
  }
};

  // Handler para cancelar edición
  const handleCancelEdit = () => {
    setFormData({
      name: currentUser.name,
      lastname: currentUser.lastname,
      phone: currentUser.phone,
      email: currentUser.email,
      rut: currentUser.rut
    });
    setIsEditingInfo(false);
    setInfoError('');
    setInfoSuccess('');
  };

  // Handler para cambiar contraseña
  // Handler para cambiar contraseña
const handleChangePassword = async (e: React.FormEvent) => {
  e.preventDefault();
  setPasswordError('');
  setPasswordSuccess('');
  setPasswordLoading(true);

  // Validaciones
  if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
    setPasswordError('Todos los campos son obligatorios');
    setPasswordLoading(false);
    return;
  }

  if (passwordData.newPassword.length < 6) {
    setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
    setPasswordLoading(false);
    return;
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    setPasswordError('Las contraseñas no coinciden');
    setPasswordLoading(false);
    return;
  }

  try {
    const response = await updateUserPassword(
      currentUser.userId,
      passwordData.currentPassword,
      passwordData.newPassword
    );

    if (response.ok) {
      setPasswordSuccess('Contraseña actualizada exitosamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      setPasswordError(response.message || 'Error al cambiar contraseña');
    }
  } catch (error) {
    console.error('Error updating password:', error);
    setPasswordError('Error de conexión con el servidor');
  } finally {
    setPasswordLoading(false);
  }
};

  return (
    <div className={styles.accountPage}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Mi Cuenta</h1>
        </div>

        <div className={styles.accountLayout}>
          {/* Sidebar de navegación */}
          <aside className={styles.accountSidebar}>
            <div className={styles.accountMenu}>
              <Link to="/mi-cuenta" className={styles.accountMenuItemActive}>
                <i className="fa-solid fa-user"></i>{}
                Detalles de la cuenta
              </Link>
              <Link to="/mis-pedidos" className={styles.accountMenuItem}>
                <i className="fa-solid fa-box"></i>{}
                Mis Pedidos
              </Link>
              <Link to="/agregar-direccion" className={styles.accountMenuItem}>
                <i className="fa-solid fa-location-dot"></i>{}
                Direcciones
              </Link>
              <button onClick={onLogout} className={styles.logoutButton}>
                <i className="fa-solid fa-right-from-bracket"></i>{}
                Cerrar Sesión
              </button>
            </div>
          </aside>

          {/* Contenido principal */}
          <div className={styles.accountContent}>
            {/* Información Personal */}
            <div className={styles.accountCard}>
              <h2 className={styles.accountCardTitle}>Información Personal</h2>
              
              {/* Mensajes de error/éxito */}
              {infoError && (
                <div className={styles.errorMessage}>
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {infoError}
                </div>
              )}
              
              {infoSuccess && (
                <div className={styles.successMessage}>
                  <i className="fa-solid fa-circle-check"></i>
                  {infoSuccess}
                </div>
              )}

              {!isEditingInfo ? (
                // MODO VISTA
                <>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Nombre</span>
                      <p>{currentUser.name}</p>
                    </div>

                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Apellidos</span>
                      <p>{currentUser.lastname}</p>
                    </div>

                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Teléfono</span>
                      <p>{currentUser.phone || 'No especificado'}</p>
                    </div>

                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>RUT</span>
                      <p>{currentUser.rut || 'No especificado'}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsEditingInfo(true)}
                    className={styles.editButton}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>{}
                    Editar Información
                  </button>
                </>
              ) : (
                // MODO EDICIÓN
                <>
                  <div className={styles.infoGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="editName">Nombre *</label>
                      <input 
                        id="editName"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ingresa tu nombre"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="editLastname">Apellidos *</label>
                      <input 
                        id="editLastname"
                        type="text"
                        value={formData.lastname}
                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                        placeholder="Ingresa tus apellidos"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="editPhone">Teléfono *</label>
                      <input 
                        id="editPhone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+56 9 1234 5678"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="editRut">RUT</label>
                      <input 
                        id="editRut"
                        type="text"
                        value={formData.rut}
                        onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                        placeholder="12.345.678-9"
                        disabled
                      />
                      <small className={styles.fieldNote}>El RUT no se puede modificar</small>
                    </div>
                  </div>

                  <div className={styles.buttonGroup}>
                    <button 
                      onClick={handleSaveInfo}
                      className={styles.saveButton}
                      disabled={infoLoading}
                    >
                      {infoLoading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>{}
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-check"></i>{}
                          Guardar Cambios
                        </>
                      )}
                    </button>

                    <button 
                      onClick={handleCancelEdit}
                      className={styles.cancelButton}
                      disabled={infoLoading}
                    >
                      <i className="fa-solid fa-xmark"></i>{}
                      Cancelar
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Cambiar Contraseña */}
            <div className={styles.accountCard}>
              <h2 className={styles.accountCardTitle}>Cambiar Contraseña</h2>
              
              {/* Mensajes de error/éxito */}
              {passwordError && (
                <div className={styles.errorMessage}>
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {passwordError}
                </div>
              )}
              
              {passwordSuccess && (
                <div className={styles.successMessage}>
                  <i className="fa-solid fa-circle-check"></i>
                  {passwordSuccess}
                </div>
              )}
              
              <form onSubmit={handleChangePassword} className={styles.passwordForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="currentPassword">Contraseña Actual *</label>
                  <input 
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">Nueva Contraseña *</label>
                  <input 
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                  <small className={styles.fieldNote}>Mínimo 6 caracteres</small>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirmar Nueva Contraseña *</label>
                  <input 
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit"
                  className={styles.saveButton}
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>{}
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-lock"></i>{}
                      Cambiar Contraseña
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};