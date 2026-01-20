import React from "react";
import { motion } from "motion/react";
import { Heart, ShoppingCart, Star, Tag, Users, Clock } from "lucide-react";
import { Product } from "@/types";
import { useApp } from "@/context/AppContext";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/app/components/ui/card";
import { ImageWithFallback } from "@/app/components/common/ImageWithFallback";
import { toast } from "sonner";

interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onClick,
}) => {
    const { addToCart, toggleFavorite, favorites } = useApp();
    const isFav = favorites.includes(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product.id);
        toast.success(`${product.name} добавлен в корзину!`);
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(product.id);
        toast.success(
            isFav
                ? `${product.name} удален из избранного`
                : `${product.name} добавлен в избранное!`,
        );
    };

    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                className="h-full cursor-pointer overflow-hidden group relative"
                onClick={onClick}
            >
                {/* Бейджи */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                    {product.isNew && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                            Новинка
                        </Badge>
                    )}
                    {product.discount && (
                        <Badge className="bg-red-500 hover:bg-red-600">
                            -{product.discount}%
                        </Badge>
                    )}
                    {product.isPopular && (
                        <Badge className="bg-purple-500 hover:bg-purple-600">
                            Популярное
                        </Badge>
                    )}
                </div>

                {/* Избранное */}
                <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleToggleFavorite}
                    className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg"
                >
                    <Heart
                        className={`w-5 h-5 ${
                            isFav
                                ? "fill-red-500 text-red-500"
                                : "text-gray-600"
                        }`}
                    />
                </motion.button>

                {/* Изображение */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                    <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                </div>

                <CardContent className="p-4">
                    {/* Название и категория */}
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                        {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                        {product.category}
                    </p>

                    {/* Рейтинг */}
                    <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                            {product.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            ({product.reviews})
                        </span>
                    </div>

                    {/* Информация об игре */}
                    <div className="flex flex-wrap gap-2 mb-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {product.players.min}-{product.players.max}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {product.duration} мин
                        </span>
                        <span>{product.ageRating}+</span>
                    </div>

                    {/* Цена */}
                    <div className="flex items-baseline gap-2">
                        {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                                {product.originalPrice} ₽
                            </span>
                        )}
                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {product.price} ₽
                        </span>
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                    <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />В корзину
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};
