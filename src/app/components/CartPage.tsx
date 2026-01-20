import React from "react";
import { motion } from "motion/react";
import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    ShoppingBag,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/app/components/ui/button";
import { ImageWithFallback } from "@/app/components/common/ImageWithFallback";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { toast } from "sonner";

interface CartPageProps {
    onNavigate: (page: string, productId?: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
    const { cart, updateCartQuantity, removeFromCart, clearCart, products } =
        useApp();

    const cartItems = cart
        .map((item) => {
            const product = products.find((p) => p.id === item.productId);
            return { ...item, product };
        })
        .filter((item) => item.product);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0,
    );
    const discount = cartItems.reduce((sum, item) => {
        const product = item.product;
        if (product?.originalPrice) {
            return (
                sum + (product.originalPrice - product.price) * item.quantity
            );
        }
        return sum;
    }, 0);
    const total = subtotal;

    const handleCheckout = () => {
        toast.success("Заказ оформлен! (Demo режим)");
        clearCart();
    };

    if (cartItems.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
            >
                <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
                <h2 className="text-3xl font-bold mb-4">Корзина пуста</h2>
                <p className="text-muted-foreground mb-8">
                    Добавьте товары в корзину, чтобы продолжить покупки
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
                <h1 className="text-4xl font-bold mb-2">Корзина</h1>
                <p className="text-muted-foreground">
                    Товаров в корзине:{" "}
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Товары */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item, idx) => {
                        const product = item.product!;
                        return (
                            <motion.div
                                key={item.productId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex gap-6">
                                            {/* Изображение */}
                                            <div
                                                className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900"
                                                onClick={() =>
                                                    onNavigate(
                                                        "product",
                                                        product.id,
                                                    )
                                                }
                                            >
                                                <ImageWithFallback
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Информация */}
                                            <div className="flex-1">
                                                <h3
                                                    className="text-xl font-semibold mb-2 cursor-pointer hover:text-purple-600 transition-colors"
                                                    onClick={() =>
                                                        onNavigate(
                                                            "product",
                                                            product.id,
                                                        )
                                                    }
                                                >
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    {product.category}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    {/* Количество */}
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() =>
                                                                updateCartQuantity(
                                                                    product.id,
                                                                    item.quantity -
                                                                        1,
                                                                )
                                                            }
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </Button>
                                                        <span className="w-12 text-center font-semibold">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() =>
                                                                updateCartQuantity(
                                                                    product.id,
                                                                    item.quantity +
                                                                        1,
                                                                )
                                                            }
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    {/* Цена */}
                                                    <div className="text-right">
                                                        {product.originalPrice && (
                                                            <p className="text-sm text-muted-foreground line-through">
                                                                {product.originalPrice *
                                                                    item.quantity}{" "}
                                                                ₽
                                                            </p>
                                                        )}
                                                        <p className="text-2xl font-bold text-purple-600">
                                                            {product.price *
                                                                item.quantity}{" "}
                                                            ₽
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Удалить */}
                                            <div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        removeFromCart(
                                                            product.id,
                                                        );
                                                        toast.success(
                                                            `${product.name} удален из корзины`,
                                                        );
                                                    }}
                                                >
                                                    <Trash2 className="w-5 h-5 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}

                    {/* Очистить корзину */}
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            clearCart();
                            toast.success("Корзина очищена");
                        }}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Очистить корзину
                    </Button>
                </div>

                {/* Итого */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1"
                >
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Итого</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Подытог:
                                </span>
                                <span className="font-semibold">
                                    {subtotal} ₽
                                </span>
                            </div>

                            {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Скидка:</span>
                                    <span className="font-semibold">
                                        -{discount} ₽
                                    </span>
                                </div>
                            )}

                            <Separator />

                            <div className="flex justify-between text-xl font-bold">
                                <span>Всего:</span>
                                <span className="text-purple-600">
                                    {total} ₽
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3">
                            <Button
                                size="lg"
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                onClick={handleCheckout}
                            >
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Оформить заказ
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => onNavigate("catalog")}
                            >
                                Продолжить покупки
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};
