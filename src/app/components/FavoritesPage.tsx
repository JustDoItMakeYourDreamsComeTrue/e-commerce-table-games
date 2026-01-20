import React from "react";
import { motion } from "motion/react";
import { Heart as HeartIcon, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ProductCard } from "./ProductCard";
import { Button } from "@/app/components/ui/button";

interface FavoritesPageProps {
    onNavigate: (page: string, productId?: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onNavigate }) => {
    const { favorites, products } = useApp();

    const favoriteProducts = products.filter((p) => favorites.includes(p.id));

    if (favoriteProducts.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
            >
                <HeartIcon className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
                <h2 className="text-3xl font-bold mb-4">Избранное пусто</h2>
                <p className="text-muted-foreground mb-8">
                    Добавьте игры в избранное, чтобы не потерять их
                </p>
                <Button size="lg" onClick={() => onNavigate("catalog")}>
                    Перейти в каталог
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Заголовок */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                    <HeartIcon className="w-10 h-10 text-red-500 fill-red-500" />
                    Избранное
                </h1>
                <p className="text-muted-foreground">
                    Товаров в избранном: {favoriteProducts.length}
                </p>
            </motion.div>

            {/* Товары */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteProducts.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <ProductCard
                            product={product}
                            onClick={() => onNavigate("product", product.id)}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Действия */}
            <div className="flex justify-center pt-8">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => onNavigate("catalog")}
                >
                    Найти ещё игры
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};
