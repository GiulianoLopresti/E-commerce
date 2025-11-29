import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../../actions/products.actions';
import { getCategories } from '../../../actions/categories.actions';
import type { ProductProps, CategoryProps } from '../../../interfaces';
import styles from '../../../style/admin.module.css';

export const ProductsAdmin = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // FormData solo usa IDs (para enviar al backend)
  const [formData, setFormData] = useState({
    name: '',
    stock: 0,
    productPhoto: '',
    description: '',
    price: 0,
    categoryId: 0,
    statusId: 1
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const response = await getProducts();
    if (response.ok) {
      setProducts(response.products);
    } else {
      setError('Error al cargar productos');
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    const response = await getCategories();
    if (response.ok) {
      setCategories(response.categories);
      // Setear la primera categoría como default
      if (response.categories.length > 0 && formData.categoryId === 0) {
        setFormData(prev => ({ ...prev, categoryId: response.categories[0].categoryId }));
      }
    }
  };

  const handleOpenModal = (product?: ProductProps) => {
    if (product) {
      setEditingProduct(product);
      // Extraer el categoryId del objeto category
      setFormData({
        name: product.name,
        stock: product.stock,
        productPhoto: product.productPhoto,
        description: product.description,
        price: product.price,
        categoryId: product.category.categoryId,
        statusId: product.status.statusId,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        stock: 0,
        productPhoto: '',
        description: '',
        price: 0,
        categoryId: categories.length > 0 ? categories[0].categoryId : 0,
        statusId: 1
      });
    }
    setIsModalOpen(true);
    setError('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingProduct) {
        // Actualizar producto existente
        const response = await updateProduct(editingProduct.productId, formData);
        if (response.ok) {
          alert('Producto actualizado exitosamente');
          await loadProducts();
          handleCloseModal();
        } else {
          setError(response.message || 'Error al actualizar producto');
        }
      } else {
        // Crear nuevo producto
        const response = await createProduct(formData);
        if (response.ok) {
          alert('Producto creado exitosamente');
          await loadProducts();
          handleCloseModal();
        } else {
          setError(response.message || 'Error al crear producto');
        }
      }
    } catch (err: any) {
      setError('Error de conexión con el servidor');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: number, productName: string) => {
    if (globalThis.confirm(`¿Estás seguro de eliminar el producto "${productName}"?`)) {
      setLoading(true);
      const response = await deleteProduct(productId);
      if (response.ok) {
        alert('Producto eliminado exitosamente');
        await loadProducts();
      } else {
        alert('Error al eliminar el producto');
      }
      setLoading(false);
    }
  };

  return (
    <div className={styles.adminSection}>
      {/* Header con botón de agregar */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <i className="fa-solid fa-box"></i> Gestión de Productos
        </h2>
        <button 
          className={styles.btnAdd}
          onClick={() => handleOpenModal()}
          disabled={loading}
        >
          <i className="fa-solid fa-plus"></i> Agregar Producto
        </button>
      </div>

      {/* Mensaje de error global */}
      {error && !isModalOpen && (
        <div className={styles.errorMessage}>
          <i className="fa-solid fa-circle-exclamation"></i> {error}
        </div>
      )}

      {/* Loading state */}
      {loading && !isModalOpen && (
        <div className={styles.loadingState}>
          <i className="fa-solid fa-spinner fa-spin"></i> Cargando productos...
        </div>
      )}

      {/* Tabla de productos */}
      {!loading && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.productId}>
                  <td>{product.productId}</td>
                  <td>
                    <img 
                      src={product.productPhoto} 
                      alt={product.name}
                      className={styles.productImage}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price.toLocaleString('es-CL')}</td>
                  <td>{product.stock}</td>
                  {/* Ahora accedemos al nombre de la categoría directamente */}
                  <td>{product.category.name}</td>
                  <td>
                    <span className={product.status.statusId === 1 ? styles.badgeActive : styles.badgeInactive}>
                      {product.status.name}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.btnEdit}
                        onClick={() => handleOpenModal(product)}
                        title="Editar"
                        disabled={loading}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        className={styles.btnDelete}
                        onClick={() => handleDelete(product.productId, product.name)}
                        title="Eliminar"
                        disabled={loading}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div className={styles.emptyState}>
          <i className="fa-solid fa-box-open"></i>
          <p>No hay productos registrados</p>
        </div>
      )}

      {/* Modal de formulario */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button 
                className={styles.modalClose}
                onClick={handleCloseModal}
                disabled={loading}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <i className="fa-solid fa-circle-exclamation"></i> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nombre *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="price">Precio *</label>
                  <input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                    min="0"
                    disabled={loading}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="stock">Stock *</label>
                  <input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    required
                    min="0"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Categoría *</label>
                <select
                  id="category"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                  required
                  disabled={loading}
                >
                  {categories.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="productPhoto">URL de la Imagen *</label>
                <input
                  id="productPhoto"
                  type="text"
                  value={formData.productPhoto}
                  onChange={(e) => setFormData({ ...formData, productPhoto: e.target.value })}
                  required
                  placeholder="https://ejemplo.com/imagen.jpg"
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Descripción *</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  disabled={loading}
                />
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.btnCancel}
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={styles.btnSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Procesando...
                    </>
                  ) : (
                    <>{editingProduct ? 'Actualizar' : 'Crear'} Producto</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};