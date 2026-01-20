import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, User, Moon, Sun, Search, Menu, X, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/components/ui/sheet';
import { Badge } from '@/app/components/ui/badge';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage, onSearch }) => {
  const { user, cart, favorites, theme, toggleTheme, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    onNavigate('catalog');
  };

  const menuItems = [
    { id: 'home', label: 'Главная' },
    { id: 'catalog', label: 'Каталог' },
    { id: 'about', label: 'О нас' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Логотип */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 font-bold text-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-purple-600" />
            </motion.div>
            <span className="hidden sm:inline">GameMagic</span>
          </motion.button>

          {/* Навигация (Desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Поиск */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Найти игру..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Действия */}
          <div className="flex items-center gap-2">
            {/* Тема */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="relative"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>
            </motion.div>

            {/* Избранное */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('favorites')}
                className="relative"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorites.length > 0 ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
                {favorites.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </motion.div>

            {/* Корзина */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('cart')}
                className="relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </motion.div>

            {/* Пользователь */}
            <Sheet>
              <SheetTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>
                    {user ? `Привет, ${user.name}!` : 'Авторизация'}
                  </SheetTitle>
                  <SheetDescription>
                    {user
                      ? `Email: ${user.email}`
                      : 'Войдите в аккаунт для доступа к функциям'}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {user ? (
                    <>
                      {user.role === 'admin' && (
                        <Button
                          className="w-full"
                          onClick={() => {
                            onNavigate('admin');
                          }}
                        >
                          Админ-панель
                        </Button>
                      )}
                      <Button variant="outline" className="w-full" onClick={logout}>
                        Выйти
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => onNavigate('login')}
                    >
                      Войти
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Мобильное меню */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Мобильное меню */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
            <form onSubmit={handleSearch} className="mt-4 lg:hidden">
              <Input
                type="text"
                placeholder="Найти игру..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};
