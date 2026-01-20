export interface Product {
    id: string;
    name: string;
    description: string;
    fullDescription?: string;
    price: number;
    originalPrice?: number;
    discount?: number;

    image: string;
    images?: string[];

    category: string;
    subcategories: string[];
    tags: string[];

    players: {
        min: number;
        max: number;
    };
    ageRating: number;
    duration: number;
    difficulty: "Легкая" | "Средняя" | "Сложная";

    publisher?: string;
    designer?: string;
    year?: number;
    language?: string;

    stock: number;
    sku?: string;

    rating: number;
    reviewsCount: number;

    isNew?: boolean;
    isPopular?: boolean;
    isFeatured?: boolean;
    isBestseller?: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon: string;
    image?: string;
    count: number;
    parentId?: string;
}

export interface CartItem {
    id?: string;
    productId: string;
    quantity: number;
    userId?: string;
    addedAt?: Date;
}

export interface User {
    id: string;
    email: string;
    password?: string;
    name: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    role: "user" | "admin";

    addresses?: Address[];

    level?: number;
    points?: number;
    ordersCount?: number;

    createdAt?: Date;
    lastLogin?: Date;
}

export interface Address {
    id: string;
    userId: string;
    fullName: string;
    phone: string;
    country: string;
    city: string;
    address: string;
    postalCode: string;
    isDefault?: boolean;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];

    subtotal: number;
    discount: number;
    shipping: number;
    total: number;

    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    paymentMethod: "card" | "cash" | "online";

    shippingAddress: Address;

    createdAt: Date;
    updatedAt: Date;
    deliveredAt?: Date;

    trackingNumber?: string;
    notes?: string;
}

export interface OrderItem {
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    discount?: number;
}

export interface Review {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    title: string;
    comment: string;
    pros?: string[];
    cons?: string[];
    images?: string[];
    helpful: number;
    verified: boolean;
    createdAt: Date;
}

export interface Favorite {
    id?: string;
    userId: string;
    productId: string;
    addedAt: Date;
}

export interface Filters {
    category?: string;
    subcategories?: string[];
    priceRange?: [number, number];
    players?: string;
    minPlayers?: number;
    maxPlayers?: number;
    ageRating?: string;
    duration?: string;
    minDuration?: number;
    maxDuration?: number;
    difficulty?: "Легкая" | "Средняя" | "Сложная";
    search?: string;
    tags?: string[];
    isNew?: boolean;
    isPopular?: boolean;
    isBestseller?: boolean;
    onSale?: boolean;
    inStock?: boolean;
    sortBy?:
        | "popular"
        | "price-asc"
        | "price-desc"
        | "rating"
        | "newest"
        | "name";
}

export interface AppSettings {
    theme: "light" | "dark";
    language: "ru" | "en";
    currency: "RUB" | "USD" | "EUR";
}

export interface Promo {
    id: string;
    code: string;
    discount: number;
    discountType: "percent" | "fixed";
    minOrderAmount?: number;
    maxDiscount?: number;
    validFrom: Date;
    validTo: Date;
    usageLimit?: number;
    usageCount: number;
    active: boolean;
}
