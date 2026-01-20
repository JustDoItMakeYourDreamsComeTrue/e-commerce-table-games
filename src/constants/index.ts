/**
 * Константы приложения
 */

// Информация о приложении
export const APP_INFO = {
  name: 'GameMagic',
  description: 'Магазин настольных игр с особенной атмосферой',
  version: '1.0.0',
  author: 'GameMagic Team',
};

// Контактная информация
export const CONTACT_INFO = {
  address: 'Москва, ул. Игровая, д. 42',
  phone: '+7 (999) 123-45-67',
  email: 'info@gamemagic.ru',
  workingHours: 'Ежедневно с 10:00 до 22:00',
};

// Социальные сети
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com',
  twitter: 'https://twitter.com',
  instagram: 'https://instagram.com',
  youtube: 'https://youtube.com',
};

// Настройки фильтров
export const FILTER_OPTIONS = {
  priceRange: {
    min: 0,
    max: 5000,
    step: 100,
  },
  players: [
    { value: '', label: 'Не важно' },
    { value: '2-2', label: 'Для 2 игроков' },
    { value: '2-4', label: '2-4 игрока' },
    { value: '2-6', label: '2-6 игроков' },
    { value: '4-10', label: '4-10 игроков' },
  ],
  ageRating: [
    { value: '', label: 'Не важно' },
    { value: '6', label: '6+' },
    { value: '8', label: '8+' },
    { value: '10', label: '10+' },
    { value: '12', label: '12+' },
    { value: '14', label: '14+' },
    { value: '16', label: '16+' },
    { value: '18', label: '18+' },
  ],
  duration: [
    { value: '', label: 'Не важно' },
    { value: '0-30', label: 'До 30 минут' },
    { value: '30-60', label: '30-60 минут' },
    { value: '60-120', label: '1-2 часа' },
    { value: '120-999', label: 'Более 2 часов' },
  ],
  difficulty: [
    { value: '', label: 'Не важно' },
    { value: 'Легкая', label: 'Легкая' },
    { value: 'Средняя', label: 'Средняя' },
    { value: 'Сложная', label: 'Сложная' },
  ],
};

// Настройки сортировки
export const SORT_OPTIONS = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'popular', label: 'По популярности' },
  { value: 'new', label: 'Новинки' },
];

// Сообщения для уведомлений
export const TOAST_MESSAGES = {
  addToCart: (productName: string) => `${productName} добавлен в корзину!`,
  removeFromCart: (productName: string) => `${productName} удален из корзины`,
  addToFavorites: (productName: string) => `${productName} добавлен в избранное!`,
  removeFromFavorites: (productName: string) => `${productName} удален из избранного`,
  loginSuccess: (userName: string) => `Добро пожаловать, ${userName}!`,
  loginError: 'Ошибка авторизации',
  orderSuccess: 'Заказ оформлен! (Demo режим)',
  clearCart: 'Корзина очищена',
  productAdded: (productName: string) => `Товар "${productName}" добавлен! (Demo режим)`,
  error: 'Произошла ошибка. Попробуйте снова.',
};

// Анимации
export const ANIMATIONS = {
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  cardHover: {
    whileHover: { scale: 1.03, y: -5 },
    whileTap: { scale: 0.98 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
};

// Медиа запросы (для использования в JS)
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};

// Настройки localStorage ключей
export const STORAGE_KEYS = {
  cart: 'boardgames_cart',
  favorites: 'boardgames_favorites',
  user: 'boardgames_user',
  theme: 'boardgames_theme',
};

export default {
  APP_INFO,
  CONTACT_INFO,
  SOCIAL_LINKS,
  FILTER_OPTIONS,
  SORT_OPTIONS,
  TOAST_MESSAGES,
  ANIMATIONS,
  BREAKPOINTS,
  STORAGE_KEYS,
};
