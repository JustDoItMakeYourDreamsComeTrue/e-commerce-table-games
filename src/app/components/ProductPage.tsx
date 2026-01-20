import React, { useState } from "react";
import { motion } from "motion/react";
import {
    Heart,
    ShoppingCart,
    Star,
    Users,
    Clock,
    Award,
    ArrowLeft,
    Plus,
    Minus,
    Check,
} from "lucide-react";
import { Product } from "@/types";
import { useApp } from "@/context/AppContext";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { ImageWithFallback } from "@/app/components/common/ImageWithFallback";
import { toast } from "sonner";

interface ProductPageProps {
    productId: string;
    onNavigate: (page: string, productId?: string) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
    productId,
    onNavigate,
}) => {
    const {
        products,
        addToCart,
        toggleFavorite,
        favorites,
        updateCartQuantity,
        cart,
    } = useApp();
    const product = products.find((p) => p.id === productId);
    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Товар не найден</h2>
                <Button onClick={() => onNavigate("catalog")}>
                    Вернуться в каталог
                </Button>
            </div>
        );
    }

    const isFav = favorites.includes(product.id);
    const relatedProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product.id);
        }
        toast.success(`${product.name} (x${quantity}) добавлен в корзину!`);
    };

    const handleToggleFavorite = () => {
        toggleFavorite(product.id);
        toast.success(
            isFav
                ? `${product.name} удален из избранного`
                : `${product.name} добавлен в избранное!`,
        );
    };

    return (
        <div className="space-y-12">
            {/* Навигация назад */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <Button variant="ghost" onClick={() => onNavigate("catalog")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Вернуться в каталог
                </Button>
            </motion.div>

            {/* Основная информация о товаре */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Изображение */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                >
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                        <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Бейджи */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.isNew && (
                            <Badge className="bg-green-500">Новинка</Badge>
                        )}
                        {product.discount && (
                            <Badge className="bg-red-500">
                                -{product.discount}%
                            </Badge>
                        )}
                    </div>
                </motion.div>

                {/* Информация */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div>
                        <Badge variant="outline" className="mb-2">
                            {product.category}
                        </Badge>
                        <h1 className="text-4xl font-bold mb-4">
                            {product.name}
                        </h1>

                        {/* Рейтинг */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${
                                            i < Math.floor(product.rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="font-medium">
                                {product.rating}
                            </span>
                            <span className="text-muted-foreground">
                                ({product.reviews} отзывов)
                            </span>
                        </div>

                        <p className="text-muted-foreground text-lg">
                            {product.description}
                        </p>
                    </div>

                    <Separator />

                    {/* Характеристики */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardContent className="p-4 flex items-center gap-3">
                                <Users className="w-8 h-8 text-purple-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Игроки
                                    </p>
                                    <p className="font-semibold">
                                        {product.players.min}-
                                        {product.players.max}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 flex items-center gap-3">
                                <Clock className="w-8 h-8 text-purple-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Время игры
                                    </p>
                                    <p className="font-semibold">
                                        {product.duration} мин
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 flex items-center gap-3">
                                <Award className="w-8 h-8 text-purple-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Возраст
                                    </p>
                                    <p className="font-semibold">
                                        {product.ageRating}+
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 flex items-center gap-3">
                                <Check className="w-8 h-8 text-purple-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Сложность
                                    </p>
                                    <p className="font-semibold">
                                        {product.difficulty}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Separator />

                    {/* Цена и действия */}
                    <div>
                        <div className="flex items-baseline gap-3 mb-6">
                            {product.originalPrice && (
                                <span className="text-xl text-muted-foreground line-through">
                                    {product.originalPrice} ₽
                                </span>
                            )}
                            <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                                {product.price} ₽
                            </span>
                        </div>

                        {/* Количество */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-sm font-medium">
                                Количество:
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-12 text-center font-semibold">
                                    {quantity}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        setQuantity(
                                            Math.min(
                                                product.stock,
                                                quantity + 1,
                                            ),
                                        )
                                    }
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                В наличии: {product.stock} шт
                            </span>
                        </div>

                        {/* Кнопки */}
                        <div className="flex gap-3">
                            <Button
                                size="lg"
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Добавить в корзину
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={handleToggleFavorite}
                            >
                                <Heart
                                    className={`w-5 h-5 ${
                                        isFav ? "fill-red-500 text-red-500" : ""
                                    }`}
                                />
                            </Button>
                        </div>
                    </div>

                    {/* Теги */}
                    {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Похожие товары */}
            {relatedProducts.length > 0 && (
                <section>
                    <h2 className="text-3xl font-bold mb-6">Похожие игры</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct, idx) => {
                            const RelatedProductCard = () => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.03 }}
                                    className="cursor-pointer"
                                    onClick={() =>
                                        onNavigate("product", relatedProduct.id)
                                    }
                                >
                                    <Card className="overflow-hidden">
                                        <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                                            <ImageWithFallback
                                                src={relatedProduct.image}
                                                alt={relatedProduct.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold mb-2 line-clamp-2">
                                                {relatedProduct.name}
                                            </h3>
                                            <p className="text-xl font-bold text-purple-600">
                                                {relatedProduct.price} ₽
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                            return (
                                <RelatedProductCard key={relatedProduct.id} />
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
};
