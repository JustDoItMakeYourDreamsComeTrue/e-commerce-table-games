import React, { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { CatalogPage } from './components/CatalogPage';
import { ProductPage } from './components/ProductPage';
import { CartPage } from './components/CartPage';
import { FavoritesPage } from './components/FavoritesPage';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import { Toaster } from '@/app/components/ui/sonner';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'favorites' | 'login' | 'admin' | 'about';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleNavigate = (page: string, productId?: string) => {
    setCurrentPage(page as Page);
    if (productId) {
      setSelectedProductId(productId);
    }
    // Прокрутка вверх при навигации
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'catalog':
        return (
          <CatalogPage
            onNavigate={handleNavigate}
            initialSearch={searchQuery}
          />
        );
      case 'product':
        return selectedProductId ? (
          <ProductPage
            productId={selectedProductId}
            onNavigate={handleNavigate}
          />
        ) : (
          <HomePage onNavigate={handleNavigate} />
        );
      case 'cart':
        return <CartPage onNavigate={handleNavigate} />;
      case 'favorites':
        return <FavoritesPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;
      case 'about':
        return (
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">О нас</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              GameMagic - это магазин настольных игр с особенной атмосферой.
              Мы верим, что каждая игра - это магия, которая объединяет людей
              и создает незабываемые моменты!
            </p>
          </div>
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header
          onNavigate={handleNavigate}
          currentPage={currentPage}
          onSearch={handleSearch}
        />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          {renderPage()}
        </main>

        <Footer onNavigate={handleNavigate} />
        
        <Toaster position="bottom-right" richColors />
      </div>
    </AppProvider>
  );
};

export default App;
