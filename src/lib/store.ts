// Управление состоянием приложения (localStorage + React Context)
import { CartItem, User } from '@/types';

// LocalStorage ключи
const CART_KEY = 'boardgames_cart';
const FAVORITES_KEY = 'boardgames_favorites';
const USER_KEY = 'boardgames_user';
const THEME_KEY = 'boardgames_theme';

// Корзина
export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (productId: string): void => {
  const cart = getCart();
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  
  saveCart(cart);
};

export const removeFromCart = (productId: string): void => {
  const cart = getCart().filter(item => item.productId !== productId);
  saveCart(cart);
};

export const updateCartQuantity = (productId: string, quantity: number): void => {
  const cart = getCart();
  const item = cart.find(item => item.productId === productId);
  
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart(cart);
    }
  }
};

export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};

// Избранное
export const getFavorites = (): string[] => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

export const saveFavorites = (favorites: string[]): void => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const toggleFavorite = (productId: string): boolean => {
  const favorites = getFavorites();
  const index = favorites.indexOf(productId);
  
  if (index > -1) {
    favorites.splice(index, 1);
    saveFavorites(favorites);
    return false;
  } else {
    favorites.push(productId);
    saveFavorites(favorites);
    return true;
  }
};

export const isFavorite = (productId: string): boolean => {
  return getFavorites().includes(productId);
};

// Пользователь (Mock Auth)
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const login = (email: string, password: string): User | null => {
  // Mock авторизация
  if (email && password) {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'user',
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Тема
export const getTheme = (): 'light' | 'dark' => {
  const theme = localStorage.getItem(THEME_KEY);
  return (theme as 'light' | 'dark') || 'light';
};

export const setTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, theme);
};
