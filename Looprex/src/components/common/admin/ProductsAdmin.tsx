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
  const [formData, setFormData] = useState<Partial<ProductProps>>({
    name: '',
    stock: 0,
    productPhoto: '',
    description: '',
    price: 0,
    categoryId: 101,
    statusId: 1
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = () => {
    const response = getProducts();
    if (response.ok) {
      setProducts(response.products);
    }
  };

  const loadCategories = () => {
    const response = getCategories();
    if (response.ok) {
      setCategories(response.categories);
    }
  };

  const handleOpenModal = (product?: ProductProps) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        stock: 0,
        productPhoto: '',
        description: '',
        price: 0,
        categoryId: 101,
        statusId: 1
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      // Actualizar producto existente
      const response = updateProduct(editingProduct.productId, formData);
      if (response.ok) {
        alert('Producto actualizado exitosamente');
        loadProducts();
        handleCloseModal();
      }
    } else {
      // Crear nuevo producto
      const response = createProduct(formData as Omit<ProductProps, 'productId'>);
      if (response.ok) {
        alert('Producto creado exitosamente');
        loadProducts();
        handleCloseModal();
      }
    }
  };

  const handleDelete = (productId: number, productName: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${productName}"?`)) {
      const response = deleteProduct(productId);
      if (response.ok) {
        alert('Producto eliminado exitosamente');
        loadProducts();
      }
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.categoryId === categoryId);
    return category ? category.name : 'Sin categoría';
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
        >
          <i className="fa-solid fa-plus"></i> Agregar Producto
        </button>
      </div>

      {/* Tabla de productos */}
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
                <td>{getCategoryName(product.categoryId)}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.btnEdit}
                      onClick={() => handleOpenModal(product)}
                      title="Editar"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      className={styles.btnDelete}
                      onClick={() => handleDelete(product.productId, product.name)}
                      title="Eliminar"
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
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nombre *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
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
                />
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.btnCancel}
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={styles.btnSubmit}
                >
                  {editingProduct ? 'Actualizar' : 'Crear'} Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};