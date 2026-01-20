import Dexie, { Table } from "dexie";
import type {
    Product,
    Category,
    User,
    CartItem,
    Favorite,
    Order,
    Review,
    Promo,
    AppSettings,
} from "../types";

export class BoardGamesDatabase extends Dexie {
    products!: Table<Product, string>;
    categories!: Table<Category, string>;
    users!: Table<User, string>;
    cart!: Table<CartItem, string>;
    favorites!: Table<Favorite, string>;
    orders!: Table<Order, string>;
    reviews!: Table<Review, string>;
    promos!: Table<Promo, string>;
    settings!: Table<AppSettings, string>;

    constructor() {
        super("BoardGamesDB");
        this.version(1).stores({
            products:
                "id, name, category, price, rating, isNew, isPopular, isFeatured, isBestseller, *tags, *subcategories",
            categories: "id, name, slug, parentId",
            users: "id, email, role",
            cart: "++id, productId, userId",
            favorites: "++id, [userId+productId], userId, productId",
            orders: "id, userId, status, createdAt",
            reviews: "id, productId, userId, rating, createdAt",
            promos: "id, code, active",
            settings: "theme",
        });
    }
}

export const db = new BoardGamesDatabase();

export const productsAPI = {
    async getAll(): Promise<Product[]> {
        return await db.products.toArray();
    },
    async getById(id: string): Promise<Product | undefined> {
        return await db.products.get(id);
    },
    async getByCategory(category: string): Promise<Product[]> {
        return await db.products.where("category").equals(category).toArray();
    },
    async search(query: string): Promise<Product[]> {
        const lowerQuery = query.toLowerCase();
        return await db.products
            .filter(
                (product) =>
                    product.name.toLowerCase().includes(lowerQuery) ||
                    product.description.toLowerCase().includes(lowerQuery) ||
                    product.tags.some((tag) =>
                        tag.toLowerCase().includes(lowerQuery),
                    ),
            )
            .toArray();
    },
    async getPopular(limit: number = 8): Promise<Product[]> {
        return await db.products
            .where("isPopular")
            .equals(1)
            .limit(limit)
            .toArray();
    },
    async getNew(limit: number = 8): Promise<Product[]> {
        return await db.products
            .where("isNew")
            .equals(1)
            .limit(limit)
            .toArray();
    },
    async getOnSale(limit: number = 8): Promise<Product[]> {
        return await db.products
            .filter((product) => product.discount && product.discount > 0)
            .limit(limit)
            .toArray();
    },
    async getFeatured(limit: number = 4): Promise<Product[]> {
        return await db.products
            .where("isFeatured")
            .equals(1)
            .limit(limit)
            .toArray();
    },
    async add(product: Product): Promise<string> {
        return await db.products.add(product);
    },
    async update(id: string, changes: Partial<Product>): Promise<number> {
        return await db.products.update(id, changes);
    },
    async delete(id: string): Promise<void> {
        await db.products.delete(id);
    },
    async filter(filters: {
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        minPlayers?: number;
        maxPlayers?: number;
        ageRating?: number;
        difficulty?: string;
        tags?: string[];
        inStock?: boolean;
    }): Promise<Product[]> {
        let products = db.products.toCollection();
        if (filters.category) {
            products = products.filter((p) => p.category === filters.category);
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            products = products.filter((p) => {
                if (
                    filters.minPrice !== undefined &&
                    p.price < filters.minPrice
                )
                    return false;
                if (
                    filters.maxPrice !== undefined &&
                    p.price > filters.maxPrice
                )
                    return false;
                return true;
            });
        }
        if (filters.minPlayers !== undefined) {
            products = products.filter(
                (p) => p.players.min <= filters.minPlayers!,
            );
        }
        if (filters.maxPlayers !== undefined) {
            products = products.filter(
                (p) => p.players.max >= filters.maxPlayers!,
            );
        }
        if (filters.ageRating !== undefined) {
            products = products.filter(
                (p) => p.ageRating <= filters.ageRating!,
            );
        }
        if (filters.difficulty) {
            products = products.filter(
                (p) => p.difficulty === filters.difficulty,
            );
        }
        if (filters.inStock) {
            products = products.filter((p) => p.stock > 0);
        }
        if (filters.tags && filters.tags.length > 0) {
            products = products.filter((p) =>
                filters.tags!.some((tag: string) => p.tags.includes(tag)),
            );
        }
        return await products.toArray();
    },
};

export const categoriesAPI = {
    async getAll(): Promise<Category[]> {
        return await db.categories.toArray();
    },
    async getById(id: string): Promise<Category | undefined> {
        return await db.categories.get(id);
    },
    async add(category: Category): Promise<string> {
        return await db.categories.add(category);
    },
    async update(id: string, changes: Partial<Category>): Promise<number> {
        return await db.categories.update(id, changes);
    },
    async delete(id: string): Promise<void> {
        await db.categories.delete(id);
    },
};

export const cartAPI = {
    async getByUserId(userId: string): Promise<CartItem[]> {
        return await db.cart.where("userId").equals(userId).toArray();
    },
    async add(item: CartItem): Promise<string> {
        const existing = await db.cart
            .where(["userId", "productId"])
            .equals([item.userId || "", item.productId])
            .first();
        if (existing && existing.id) {
            await db.cart.update(existing.id, {
                quantity: existing.quantity + item.quantity,
            });
            return existing.id;
        }
        return await db.cart.add({ ...item, addedAt: new Date() });
    },
    async updateQuantity(id: string, quantity: number): Promise<number> {
        if (quantity <= 0) {
            await db.cart.delete(id);
            return 0;
        }
        return await db.cart.update(id, { quantity });
    },
    async remove(id: string): Promise<void> {
        await db.cart.delete(id);
    },
    async clear(userId: string): Promise<void> {
        await db.cart.where("userId").equals(userId).delete();
    },
};

export const favoritesAPI = {
    async getByUserId(userId: string): Promise<Favorite[]> {
        return await db.favorites.where("userId").equals(userId).toArray();
    },
    async add(userId: string, productId: string): Promise<string> {
        const existing = await db.favorites
            .where(["userId", "productId"])
            .equals([userId, productId])
            .first();
        if (existing && existing.id) {
            return existing.id;
        }
        return await db.favorites.add({
            userId,
            productId,
            addedAt: new Date(),
        });
    },
    async remove(userId: string, productId: string): Promise<void> {
        const item = await db.favorites
            .where(["userId", "productId"])
            .equals([userId, productId])
            .first();
        if (item && item.id) {
            await db.favorites.delete(item.id);
        }
    },
    async toggle(userId: string, productId: string): Promise<boolean> {
        const existing = await db.favorites
            .where(["userId", "productId"])
            .equals([userId, productId])
            .first();
        if (existing && existing.id) {
            await db.favorites.delete(existing.id);
            return false;
        } else {
            await this.add(userId, productId);
            return true;
        }
    },
    async isFavorite(userId: string, productId: string): Promise<boolean> {
        const count = await db.favorites
            .where(["userId", "productId"])
            .equals([userId, productId])
            .count();
        return count > 0;
    },
};

export const usersAPI = {
    async getAll(): Promise<User[]> {
        return await db.users.toArray();
    },
    async getById(id: string): Promise<User | undefined> {
        return await db.users.get(id);
    },
    async getByEmail(email: string): Promise<User | undefined> {
        return await db.users.where("email").equals(email).first();
    },
    async add(user: User): Promise<string> {
        return await db.users.add({ ...user, createdAt: new Date() });
    },
    async update(id: string, changes: Partial<User>): Promise<number> {
        return await db.users.update(id, changes);
    },
    async delete(id: string): Promise<void> {
        await db.users.delete(id);
    },
    async authenticate(email: string, password: string): Promise<User | null> {
        const user = await this.getByEmail(email);
        if (user && user.password === password) {
            await this.update(user.id, { lastLogin: new Date() });
            return user;
        }
        return null;
    },
};

export const ordersAPI = {
    async getAll(): Promise<Order[]> {
        return await db.orders.orderBy("createdAt").reverse().toArray();
    },
    async getById(id: string): Promise<Order | undefined> {
        return await db.orders.get(id);
    },
    async getByUserId(userId: string): Promise<Order[]> {
        return await db.orders
            .where("userId")
            .equals(userId)
            .reverse()
            .sortBy("createdAt");
    },
    async add(order: Order): Promise<string> {
        return await db.orders.add(order);
    },
    async update(id: string, changes: Partial<Order>): Promise<number> {
        return await db.orders.update(id, {
            ...changes,
            updatedAt: new Date(),
        });
    },
    async updateStatus(id: string, status: Order["status"]): Promise<number> {
        return await this.update(id, { status });
    },
};

export const reviewsAPI = {
    async getByProductId(productId: string): Promise<Review[]> {
        return await db.reviews
            .where("productId")
            .equals(productId)
            .reverse()
            .sortBy("createdAt");
    },
    async add(review: Review): Promise<string> {
        return await db.reviews.add(review);
    },
    async update(id: string, changes: Partial<Review>): Promise<number> {
        return await db.reviews.update(id, changes);
    },
    async delete(id: string): Promise<void> {
        await db.reviews.delete(id);
    },
};

export const settingsAPI = {
    async get(): Promise<AppSettings> {
        const settings = await db.settings.toArray();
        return (
            settings[0] || { theme: "light", language: "ru", currency: "RUB" }
        );
    },
    async set(settings: Partial<AppSettings>): Promise<void> {
        const current = await this.get();
        await db.settings.clear();
        await db.settings.add({ ...current, ...settings });
    },
    async setTheme(theme: "light" | "dark"): Promise<void> {
        await this.set({ theme });
    },
};

export default db;
