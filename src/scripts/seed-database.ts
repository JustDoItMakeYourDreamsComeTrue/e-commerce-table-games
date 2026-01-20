/**
 * Скрипт для наполнения базы данных товарами
 *
 * ИНСТРУКЦИЯ ПО ИСПОЛЬЗОВАНИЮ:
 * Этот скрипт предназначен для автоматического наполнения базы данных
 * настольными играми. В текущей версии используются mock-данные из
 * /src/data/products.ts
 *
 * При подключении реальной базы данных (например, Supabase):
 * 1. Замените mock-данные на реальные SQL-запросы или API-вызовы
 * 2. Настройте подключение к базе данных
 * 3. Запустите скрипт для первоначального наполнения
 *
 * СТРУКТУРА БАЗЫ ДАННЫХ:
 *
 * Таблица: products
 * - id: string (UUID)
 * - name: string
 * - description: text
 * - price: number
 * - originalPrice: number (nullable)
 * - discount: number (nullable)
 * - image: string (URL)
 * - category: string
 * - subcategories: string[] (JSON)
 * - playersMin: number
 * - playersMax: number
 * - ageRating: number
 * - duration: number
 * - difficulty: enum('Легкая', 'Средняя', 'Сложная')
 * - stock: number
 * - rating: number
 * - reviews: number
 * - isNew: boolean
 * - isPopular: boolean
 * - isFeatured: boolean
 * - tags: string[] (JSON)
 * - createdAt: timestamp
 * - updatedAt: timestamp
 *
 * Таблица: categories
 * - id: string
 * - name: string
 * - icon: string
 * - count: number
 *
 * Таблица: users
 * - id: string (UUID)
 * - email: string (unique)
 * - name: string
 * - role: enum('user', 'admin')
 * - createdAt: timestamp
 *
 * Таблица: cart_items
 * - id: string (UUID)
 * - userId: string (FK to users)
 * - productId: string (FK to products)
 * - quantity: number
 * - createdAt: timestamp
 *
 * Таблица: favorites
 * - id: string (UUID)
 * - userId: string (FK to users)
 * - productId: string (FK to products)
 * - createdAt: timestamp
 *
 * ПРИМЕР SQL ДЛЯ СОЗДАНИЯ ТАБЛИЦ:
 */

export const createTablesSQL = `
-- Таблица товаров
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  discount INTEGER,
  image TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategories JSONB DEFAULT '[]',
  players_min INTEGER NOT NULL,
  players_max INTEGER NOT NULL,
  age_rating INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  difficulty VARCHAR(20) CHECK (difficulty IN ('Легкая', 'Средняя', 'Сложная')),
  stock INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  is_new BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица категорий
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10),
  count INTEGER DEFAULT 0
);

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица корзины
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Таблица избранного
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Индексы для оптимизации
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_new ON products(is_new);
CREATE INDEX idx_products_is_popular ON products(is_popular);
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
`;

/**
 * ПРИМЕР ВСТАВКИ ДАННЫХ:
 *
 * Функция для вставки товара в базу данных
 */
export const insertProductSQL = (product: any) => `
INSERT INTO products (
  name, description, price, original_price, discount, image,
  category, subcategories, players_min, players_max,
  age_rating, duration, difficulty, stock, rating, reviews,
  is_new, is_popular, is_featured, tags
) VALUES (
  '${product.name}',
  '${product.description}',
  ${product.price},
  ${product.originalPrice || "NULL"},
  ${product.discount || "NULL"},
  '${product.image}',
  '${product.category}',
  '${JSON.stringify(product.subcategories)}'::jsonb,
  ${product.players.min},
  ${product.players.max},
  ${product.ageRating},
  ${product.duration},
  '${product.difficulty}',
  ${product.stock},
  ${product.rating},
  ${product.reviews},
  ${product.isNew || false},
  ${product.isPopular || false},
  ${product.isFeatured || false},
  '${JSON.stringify(product.tags)}'::jsonb
);
`;

/**
 * MOCK-функция для демонстрации процесса наполнения БД
 */
export const seedDatabase = async () => {
    console.log("Начало наполнения базы данных...");

    // В реальном приложении здесь будет подключение к БД
    // const db = await connectToDatabase();

    // Создание таблиц
    // await db.query(createTablesSQL);
    console.log("Таблицы созданы");

    // Вставка товаров
    // for (const product of mockProducts) {
    //   await db.query(insertProductSQL(product));
    // }
    console.log("Товары добавлены");

    // Вставка категорий
    console.log("Категории добавлены");

    console.log("База данных успешно наполнена!");
};

/**
 * ИНСТРУКЦИЯ ПО ЗАМЕНЕ КАРТИНОК:
 *
 * Все изображения товаров находятся в поле 'image' каждого товара.
 * Чтобы заменить картинки:
 *
 * 1. Подготовьте изображения в формате JPG или PNG
 * 2. Загрузите их на CDN или в облачное хранилище
 * 3. Получите публичные URL изображений
 * 4. Обновите поле 'image' в файле /src/data/products.ts
 *
 * Или через админ-панель:
 * 1. Войдите как администратор
 * 2. Перейдите в раздел "Управление товарами"
 * 3. Отредактируйте товар и вставьте новый URL изображения
 *
 * Рекомендуемый размер изображений: 1080x1080px
 */

export default seedDatabase;
