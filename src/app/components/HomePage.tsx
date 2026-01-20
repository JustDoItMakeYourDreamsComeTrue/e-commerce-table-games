import React from "react";
import { motion } from "motion/react";
import {
    ArrowRight,
    Sparkles,
    TrendingUp,
    Gift,
    Clock,
    Flame,
} from "lucide-react";
import { Product } from "@/types";
import { useApp } from "@/context/AppContext";
import { ProductCard } from "./ProductCard";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

interface HomePageProps {
    onNavigate: (page: string, productId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    const { products } = useApp();

    const newProducts = products.filter((p) => p.isNew).slice(0, 4);
    const popularProducts = products.filter((p) => p.isPopular).slice(0, 4);
    const discountedProducts = products.filter((p) => p.discount).slice(0, 4);
    const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 3);

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-12 md:p-20 text-white"
            >
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-10 right-10 opacity-20"
                >
                    <Sparkles className="w-32 h-32" />
                </motion.div>

                <div className="relative z-10 max-w-2xl">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-6xl font-bold mb-6"
                    >
                        Магия настольных игр
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl mb-8 text-white/90"
                    >
                        Откройте для себя мир увлекательных приключений,
                        стратегий и веселья для всей семьи!
                    </motion.p>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Button
                            size="lg"
                            variant="secondary"
                            className="text-lg"
                            onClick={() => onNavigate("catalog")}
                        >
                            Перейти в каталог
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </motion.div>
                </div>
            </motion.section>

            {/* Категории быстрого доступа */}
            <section>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: <Clock className="w-8 h-8" />,
                            title: "Новинки",
                            description: "Последние поступления",
                            color: "from-green-500 to-emerald-600",
                            count: newProducts.length,
                        },
                        {
                            icon: <TrendingUp className="w-8 h-8" />,
                            title: "Популярное",
                            description: "Любимые игры покупателей",
                            color: "from-purple-500 to-pink-600",
                            count: popularProducts.length,
                        },
                        {
                            icon: <Gift className="w-8 h-8" />,
                            title: "Скидки",
                            description: "Специальные предложения",
                            color: "from-orange-500 to-red-600",
                            count: discountedProducts.length,
                        },
                    ].map((category, idx) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Card
                                className={`cursor-pointer bg-gradient-to-br ${category.color} text-white border-none`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            {category.icon}
                                            <h3 className="text-xl font-bold mt-4">
                                                {category.title}
                                            </h3>
                                            <p className="text-white/80 text-sm mt-1">
                                                {category.description}
                                            </p>
                                            <p className="text-2xl font-bold mt-2">
                                                {category.count}+
                                            </p>
                                        </div>
                                        <ArrowRight className="w-6 h-6" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Новинки */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Новинки</h2>
                        <p className="text-muted-foreground">
                            Только что поступили в продажу
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => onNavigate("catalog")}
                    >
                        Смотреть все
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {newProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <ProductCard
                                product={product}
                                onClick={() =>
                                    onNavigate("product", product.id)
                                }
                            />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Популярное */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                            <Flame className="w-8 h-8 text-orange-500" />
                            Популярное
                        </h2>
                        <p className="text-muted-foreground">
                            Любимые игры наших покупателей
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => onNavigate("catalog")}
                    >
                        Смотреть все
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {popularProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <ProductCard
                                product={product}
                                onClick={() =>
                                    onNavigate("product", product.id)
                                }
                            />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Специальные предложения */}
            <section className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 rounded-3xl p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                            <Gift className="w-8 h-8 text-purple-500" />
                            Специальные предложения
                        </h2>
                        <p className="text-muted-foreground">
                            Успейте купить со скидкой!
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => onNavigate("catalog")}
                    >
                        Смотреть все
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {discountedProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <ProductCard
                                product={product}
                                onClick={() =>
                                    onNavigate("product", product.id)
                                }
                            />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Избранные товары */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                            <Sparkles className="w-8 h-8 text-yellow-500" />
                            Выбор редакции
                        </h2>
                        <p className="text-muted-foreground">
                            Лучшие игры по мнению экспертов
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.15 }}
                        >
                            <ProductCard
                                product={product}
                                onClick={() =>
                                    onNavigate("product", product.id)
                                }
                            />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white"
            >
                <Sparkles className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Присоединяйтесь к игровому сообществу!
                </h2>
                <p className="text-xl mb-6 text-white/90">
                    Получайте эксклюзивные предложения и новости первыми
                </p>
                <Button size="lg" variant="secondary">
                    Подписаться на рассылку
                </Button>
            </motion.section>
        </div>
    );
};
