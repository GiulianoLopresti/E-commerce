import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { NavBar } from './components/common/navBar/NavBar';
import { CategoryNav } from './components/common/categoryNav/Category';
import { AppRoutes } from './routes/AppRoutes';
import { getProducts } from './actions/products.actions';
import type { UserProps, Cart, ProductProps } from './interfaces';

export const EcommerceApp = () => {
  const [currentUser, setCurrentUser] = useState<UserProps | null>(null);
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);

  // Cargar productos al inicio
  useEffect(() => {
    const response = getProducts();
    if (response.ok) {
      setAllProducts(response.products);
      setFilteredProducts(response.products);
    }
  }, []);

  // Función de búsqueda
  const handleSearch = useCallback((query: string) => {
    query = query.trim().toLowerCase();

    if (query.length === 0) {
      setFilteredProducts(allProducts);
      return;
    }

    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );

    setFilteredProducts(filtered);
  }, [allProducts]);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    // Tu lógica de login aquí
  };

  // ==================== CART HANDLERS ====================
  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddToCart = (productId: number, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.productId === productId);
      
      if (existingItem) {
        return {
          items: prevCart.items.map(item =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      }
      
      return {
        items: [...prevCart.items, { productId, quantity }]
      };
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(prevCart => ({
      items: prevCart.items.filter(item => item.productId !== productId)
    }));
  };

  const handleUpdateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    setCart(prevCart => ({
      items: prevCart.items.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    }));
  };

  const handleClearCart = () => {
    setCart({ items: [] });
  };

  // ==================== RENDER ====================
  return (
    <BrowserRouter>
      <NavBar
        currentUser={currentUser}
        cartItemCount={cart.items.reduce((sum, item) => sum + item.quantity, 0)}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />
      <CategoryNav />
      <AppRoutes
        currentUser={currentUser}
        cart={cart}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateCartQuantity={handleUpdateCartQuantity}
        onClearCart={handleClearCart}
      />
    </BrowserRouter>
  );
};