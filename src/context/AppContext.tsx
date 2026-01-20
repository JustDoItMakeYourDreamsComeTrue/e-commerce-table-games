import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { User, CartItem, Product, Category } from "../types";
import {
    usersAPI,
    cartAPI,
    favoritesAPI,
    productsAPI,
    categoriesAPI,
    settingsAPI,
} from "../lib/database";
interface AppContextType {
    user: User | null;
    isAuthenticated: boolean;
    cart: CartItem[];
    cartCount: number;
    cartTotal: number;
    favorites: string[];
    favoriteProducts: Product[];
    theme: "light" | "dark";
    products: Product[];
    categories: Category[];
    loading: boolean;
    login: (email: string, password: string) => Promise<User | null>;
    register: (
        email: string,
        password: string,
        name: string,
    ) => Promise<User | null>;
    logout: () => Promise<void>;
    addToCart: (productId: string, quantity?: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    toggleFavorite: (productId: string) => Promise<void>;
    isFavorite: (productId: string) => boolean;
    toggleTheme: () => Promise<void>;
    refreshProducts: () => Promise<void>;
    getProductById: (id: string) => Promise<Product | undefined>;
}
const AppContext = createContext<AppContextType | undefined>(undefined);
export const AppProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
    const [theme, setThemeState] = useState<"light" | "dark">("light");
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        initializeApp();
    }, []);
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);
    useEffect(() => {
        updateFavoriteProducts();
    }, [favorites, products]);
    useEffect(() => {
        if (user) {
            loadCart();
            loadFavorites();
        } else {
            setCart([]);
            setFavorites([]);
        }
    }, [user]);
    const initializeApp = async () => {
        try {
            const settings = await settingsAPI.get();
            setThemeState(settings.theme);
            const savedUser = localStorage.getItem("currentUser");
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                const dbUser = await usersAPI.getById(parsedUser.id);
                if (dbUser) {
                    setUser(dbUser);
                } else {
                    localStorage.removeItem("currentUser");
                }
            }
            await refreshProducts();
            await loadCategories();
        } catch (error) {
            console.error("Ошибка инициализации приложения:", error);
        } finally {
            setLoading(false);
        }
    };
    const refreshProducts = async () => {
        try {
            const allProducts = await productsAPI.getAll();
            setProducts(allProducts);
        } catch (error) {
            console.error("Ошибка загрузки продуктов:", error);
        }
    };
    const loadCategories = async () => {
        try {
            const allCategories = await categoriesAPI.getAll();
            setCategories(allCategories);
        } catch (error) {
            console.error("Ошибка загрузки категорий:", error);
        }
    };
    const loadCart = async () => {
        if (!user) return;
        try {
            const userCart = await cartAPI.getByUserId(user.id);
            setCart(userCart);
        } catch (error) {
            console.error("Ошибка загрузки корзины:", error);
        }
    };
    const loadFavorites = async () => {
        if (!user) return;
        try {
            const userFavorites = await favoritesAPI.getByUserId(user.id);
            setFavorites(
                userFavorites.map((f: { productId: string }) => f.productId),
            );
        } catch (error) {
            console.error("Ошибка загрузки избранного:", error);
        }
    };
    const updateFavoriteProducts = async () => {
        if (favorites.length === 0) {
            setFavoriteProducts([]);
            return;
        }
        const favProds = products.filter((p) => favorites.includes(p.id));
        setFavoriteProducts(favProds);
    };
    const handleLogin = async (
        email: string,
        password: string,
    ): Promise<User | null> => {
        try {
            const loggedUser = await usersAPI.authenticate(email, password);
            if (loggedUser) {
                setUser(loggedUser);
                localStorage.setItem("currentUser", JSON.stringify(loggedUser));
                return loggedUser;
            }
            return null;
        } catch (error) {
            console.error("Ошибка входа:", error);
            return null;
        }
    };
    const handleRegister = async (
        email: string,
        password: string,
        name: string,
    ): Promise<User | null> => {
        try {
            const existingUser = await usersAPI.getByEmail(email);
            if (existingUser) {
                // User already exists
                return null;
            }
            const newUser: User = {
                id: `user-${Date.now()}`,
                email,
                password,
                name,
                role: "user",
                level: 1,
                points: 0,
                ordersCount: 0,
                createdAt: new Date(),
            };
            await usersAPI.add(newUser);
            setUser(newUser);
            localStorage.setItem("currentUser", JSON.stringify(newUser));
            return newUser;
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            return null;
        }
    };
    const handleLogout = async (): Promise<void> => {
        try {
            setUser(null);
            setCart([]);
            setFavorites([]);
            localStorage.removeItem("currentUser");
        } catch (error) {
            console.error("Ошибка выхода:", error);
        }
    };
    const handleAddToCart = async (
        productId: string,
        quantity: number = 1,
    ): Promise<void> => {
        if (!user) {
            console.error("Необходимо войти в систему");
            return;
        }
        try {
            await cartAPI.add({
                productId,
                quantity,
                userId: user.id,
                addedAt: new Date(),
            });
            await loadCart();
        } catch (error) {
            console.error("Ошибка добавления в корзину:", error);
        }
    };
    const handleRemoveFromCart = async (productId: string): Promise<void> => {
        if (!user) return;
        try {
            const item = cart.find((c) => c.productId === productId);
            if (item && item.id) {
                await cartAPI.remove(item.id);
                await loadCart();
            }
        } catch (error) {
            console.error("Ошибка удаления из корзины:", error);
        }
    };
    const handleUpdateCartQuantity = async (
        productId: string,
        quantity: number,
    ): Promise<void> => {
        if (!user) return;
        try {
            const item = cart.find((c) => c.productId === productId);
            if (item && item.id) {
                if (quantity <= 0) {
                    await cartAPI.remove(item.id);
                } else {
                    await cartAPI.updateQuantity(item.id, quantity);
                }
                await loadCart();
            }
        } catch (error) {
            console.error("Ошибка обновления количества:", error);
        }
    };
    const handleClearCart = async (): Promise<void> => {
        if (!user) return;
        try {
            await cartAPI.clear(user.id);
            setCart([]);
        } catch (error) {
            console.error("Ошибка очистки корзины:", error);
        }
    };
    const handleToggleFavorite = async (productId: string): Promise<void> => {
        if (!user) {
            console.error("Необходимо войти в систему");
            return;
        }
        try {
            await favoritesAPI.toggle(user.id, productId);
            await loadFavorites();
        } catch (error) {
            console.error("Ошибка переключения избранного:", error);
        }
    };
    const checkIsFavorite = (productId: string): boolean => {
        return favorites.includes(productId);
    };
    const handleToggleTheme = async (): Promise<void> => {
        try {
            const newTheme = theme === "light" ? "dark" : "light";
            await settingsAPI.setTheme(newTheme);
            setThemeState(newTheme);
        } catch (error) {
            console.error("Ошибка переключения темы:", error);
        }
    };
    const getProductById = async (id: string): Promise<Product | undefined> => {
        try {
            return await productsAPI.getById(id);
        } catch (error) {
            console.error("Ошибка получения продукта:", error);
            return undefined;
        }
    };
    const cartTotal = cart.reduce((total, item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return total;
        return total + product.price * item.quantity;
    }, 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    return (
        <AppContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                cart,
                cartCount,
                cartTotal,
                favorites,
                favoriteProducts,
                theme,
                products,
                categories,
                loading,
                login: handleLogin,
                register: handleRegister,
                logout: handleLogout,
                addToCart: handleAddToCart,
                removeFromCart: handleRemoveFromCart,
                updateCartQuantity: handleUpdateCartQuantity,
                clearCart: handleClearCart,
                toggleFavorite: handleToggleFavorite,
                isFavorite: checkIsFavorite,
                toggleTheme: handleToggleTheme,
                refreshProducts,
                getProductById,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within AppProvider");
    }
    return context;
};
