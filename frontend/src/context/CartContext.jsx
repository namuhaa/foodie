import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'foodie_cart_items';
const COUPON_STORAGE_KEY = 'foodie_applied_coupon';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      return localStorage.getItem(COUPON_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [toast, setToast] = useState(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, appliedCoupon);
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  };

  const clearToast = () => {
    setToast(null);
  };

  const addToCart = (food, quantity = 1) => {
    setCart((prevCart) => {
      const foodId = food._id || food.id;
      const existing = prevCart.find((item) => (item._id || item.id) === foodId);
      if (existing) {
        return prevCart.map((item) =>
          (item._id || item.id) === foodId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...food, quantity }];
      }
    });
    showToast(`Added "${food.name}" to cart! 🛒`);
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item._id || item.id) === foodId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (foodId) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => (i._id || i.id) === foodId);
      if (item) {
        showToast(`Removed "${item.name}" from cart`, 'info');
      }
      return prevCart.filter((i) => (i._id || i.id) !== foodId);
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon('');
  };

  const getItemQuantity = (foodId) => {
    const item = cart.find((i) => (i._id || i.id) === foodId);
    return item ? item.quantity : 0;
  };

  // Calculations
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Delivery fee is $0 if subtotal is over $25 or cart is empty, else $2.99
  const deliveryFee = subtotal === 0 || subtotal >= 25 ? 0 : 2.99;

  // 5% Tax
  const tax = subtotal > 0 ? Number((subtotal * 0.05).toFixed(2)) : 0;

  // Coupon logic
  let discount = 0;
  if (appliedCoupon === 'FOODIE20') {
    discount = Number((subtotal * 0.2).toFixed(2));
  } else if (appliedCoupon === 'WELCOME5') {
    discount = Math.min(5, subtotal);
  }

  const totalPrice = Math.max(0, Number((subtotal + deliveryFee + tax - discount).toFixed(2)));

  const applyCoupon = (code) => {
    const formatted = (code || '').trim().toUpperCase();
    if (formatted === 'FOODIE20') {
      setAppliedCoupon('FOODIE20');
      showToast('🎉 Promo code FOODIE20 applied! 20% discount added.', 'success');
      return { success: true, message: '20% discount applied!' };
    } else if (formatted === 'WELCOME5') {
      setAppliedCoupon('WELCOME5');
      showToast('🎉 Promo code WELCOME5 applied! $5 discount added.', 'success');
      return { success: true, message: '$5 discount applied!' };
    } else {
      showToast('❌ Invalid coupon code. Try FOODIE20 or WELCOME5', 'error');
      return { success: false, message: 'Invalid coupon code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
    showToast('Coupon code removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        totalItems,
        subtotal: Number(subtotal.toFixed(2)),
        deliveryFee: Number(deliveryFee.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        totalPrice,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        toast,
        showToast,
        clearToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
