import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAddress } from '../actions/addresses.actions';
import { getRegions } from '../actions/regions.actions';
import { getCommunesByRegion } from '../actions/comuna.actions';
import type { UserProps, RegionProps, ComunaProps } from '../interfaces';
import styles from '../style/pages.module.css';

interface AddressPageProps {
  currentUser: UserProps | null;
}

export const AddAddressPage = ({ currentUser }: AddressPageProps) => {
  const navigate = useNavigate();
  const [regions, setRegions] = useState<RegionProps[]>([]);
  const [comunas, setComunas] = useState<ComunaProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    street: '',
    number: '',
    regionId: 0,
    comunaId: 0,
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    loadRegions();
  }, [currentUser, navigate]);

  const loadRegions = async () => {
    const response = await getRegions();
    if (response.ok) {
      setRegions(response.regions);
    }
  };

  const handleRegionChange = async (regionId: number) => {
    setFormData({ ...formData, regionId, comunaId: 0 });
    
    if (regionId > 0) {
      const response = await getCommunesByRegion(regionId);
      if (response.ok) {
        setComunas(response.communes);
      }
    } else {
      setComunas([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!currentUser) return;

  setLoading(true);
  setError('');

  try {
    const response = await createAddress({
      userId: currentUser.userId,
      street: formData.street,
      number: formData.number,
      comunaId: formData.comunaId, 
    });

    if (response.ok) {
      alert('Dirección agregada exitosamente');
      navigate('/checkout');
    } else {
      setError(response.message || 'Error al agregar dirección');
    }
  } catch (err) {
    console.error('Error al agregar dirección:', err);
    setError('Error al agregar dirección');
  } finally {
    setLoading(false);
  }
};

  if (!currentUser) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>Agregar Dirección de Envío</h1>

        {error && (
          <div className={styles.errorMessage}>
            <i className="fa-solid fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="street">Calle *</label>
            <input
              id="street"
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              required
              placeholder="Ej: Av. Libertador Bernardo O'Higgins"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="number">Número *</label>
            <input
              id="number"
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              required
              placeholder="Ej: 1234"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="region">Región *</label>
            <select
              id="region"
              value={formData.regionId}
              onChange={(e) => handleRegionChange(Number(e.target.value))}
              required
            >
              <option value={0}>Selecciona una región</option>
              {regions.map(region => (
                <option key={region.regionId} value={region.regionId}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="comuna">Comuna *</label>
            <select
              id="comuna"
              value={formData.comunaId}
              onChange={(e) => setFormData({ ...formData, comunaId: Number(e.target.value) })}
              required
              disabled={comunas.length === 0}
            >
              <option value={0}>Selecciona una comuna</option>
              {comunas.map(comuna => (
                <option key={comuna.comunaId} value={comuna.comunaId}>
                  {comuna.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={styles.buttonSecondary}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.buttonPrimary}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Dirección'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};