import React, { useState } from "react";
import { motion } from "motion/react";
import {
    Plus,
    Package,
    Users,
    TrendingUp,
    DollarSign,
    Edit,
    Trash2,
    Save,
    LayoutDashboard,
} from "lucide-react";
import { Product } from "@/types";
import { useApp } from "@/context/AppContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { ImageWithFallback } from "@/app/components/common/ImageWithFallback";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { toast } from "sonner";

interface AdminPageProps {
    onNavigate: (page: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
    const { user, products: allProducts } = useApp();
    const [products] = useState(allProducts);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: "",
        description: "",
        price: 0,
        category: "Семейные игры",
        players: { min: 2, max: 4 },
        ageRating: 8,
        duration: 30,
        difficulty: "Средняя",
        stock: 0,
        rating: 0,
        reviews: 0,
        subcategories: [],
        tags: [],
        image: "https://images.unsplash.com/photo-1763875018477-e0e831ccf180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWUlMjBjYXJkcyUyMHRhYmxlfGVufDF8fHx8MTc2ODc0MTIzM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    });

    if (!user || user.role !== "admin") {
        return (
            <div className="text-center py-20">
                <h2 className="text-3xl font-bold mb-4">Доступ запрещен</h2>
                <p className="text-muted-foreground mb-8">
                    Только администраторы имеют доступ к этой странице
                </p>
                <Button onClick={() => onNavigate("home")}>На главную</Button>
            </div>
        );
    }

    const stats = [
        {
            title: "Всего товаров",
            value: products.length,
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900",
        },
        {
            title: "Активных пользователей",
            value: "1,234",
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900",
        },
        {
            title: "Продаж за месяц",
            value: "3,456",
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900",
        },
        {
            title: "Выручка",
            value: "₽2.4M",
            icon: DollarSign,
            color: "text-orange-600",
            bgColor: "bg-orange-100 dark:bg-orange-900",
        },
    ];

    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.price) {
            toast.error("Заполните обязательные поля");
            return;
        }

        toast.success(`Товар "${newProduct.name}" добавлен! (Demo режим)`);
        setIsAddDialogOpen(false);
        setNewProduct({
            name: "",
            description: "",
            price: 0,
            category: "Семейные игры",
            players: { min: 2, max: 4 },
            ageRating: 8,
            duration: 30,
            difficulty: "Средняя",
            stock: 0,
            rating: 0,
            reviews: 0,
            subcategories: [],
            tags: [],
            image: "https://images.unsplash.com/photo-1763875018477-e0e831ccf180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWUlMjBjYXJkcyUyMHRhYmxlfGVufDF8fHx8MTc2ODc0MTIzM3ww&ixlib=rb-4.1.0&q=80&w=1080",
        });
    };

    return (
        <div className="space-y-8">
            {/* Заголовок */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                    <LayoutDashboard className="w-10 h-10 text-purple-600" />
                    Админ-панель
                </h1>
                <p className="text-muted-foreground">
                    Управление товарами и настройками магазина
                </p>
            </motion.div>

            {/* Статистика */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-3 rounded-lg ${stat.bgColor}`}
                                    >
                                        <stat.icon
                                            className={`w-6 h-6 ${stat.color}`}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {stat.title}
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {stat.value}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Управление товарами */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Управление товарами</CardTitle>
                            <CardDescription>
                                Добавляйте, редактируйте и удаляйте товары
                            </CardDescription>
                        </div>
                        <Dialog
                            open={isAddDialogOpen}
                            onOpenChange={setIsAddDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Добавить товар
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>
                                        Добавить новый товар
                                    </DialogTitle>
                                    <DialogDescription>
                                        Заполните информацию о товаре. Поля
                                        отмечены * обязательны.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Название *</Label>
                                        <Input
                                            id="name"
                                            value={newProduct.name}
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Название игры"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Описание
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={newProduct.description}
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    description: e.target.value,
                                                })
                                            }
                                            placeholder="Описание игры"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="price">
                                                Цена * (₽)
                                            </Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                value={newProduct.price}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        price: Number(
                                                            e.target.value,
                                                        ),
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="stock">
                                                Количество
                                            </Label>
                                            <Input
                                                id="stock"
                                                type="number"
                                                value={newProduct.stock}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        stock: Number(
                                                            e.target.value,
                                                        ),
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">
                                            Категория
                                        </Label>
                                        <Select
                                            value={newProduct.category}
                                            onValueChange={(value) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    category: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Карточные игры">
                                                    Карточные игры
                                                </SelectItem>
                                                <SelectItem value="Семейные игры">
                                                    Семейные игры
                                                </SelectItem>
                                                <SelectItem value="Стратегические игры">
                                                    Стратегические игры
                                                </SelectItem>
                                                <SelectItem value="Пазлы">
                                                    Пазлы
                                                </SelectItem>
                                                <SelectItem value="Аксессуары">
                                                    Аксессуары
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="age">Возраст</Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                value={newProduct.ageRating}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        ageRating: Number(
                                                            e.target.value,
                                                        ),
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="duration">
                                                Время (мин)
                                            </Label>
                                            <Input
                                                id="duration"
                                                type="number"
                                                value={newProduct.duration}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        duration: Number(
                                                            e.target.value,
                                                        ),
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="difficulty">
                                                Сложность
                                            </Label>
                                            <Select
                                                value={newProduct.difficulty}
                                                onValueChange={(value: any) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        difficulty: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Легкая">
                                                        Легкая
                                                    </SelectItem>
                                                    <SelectItem value="Средняя">
                                                        Средняя
                                                    </SelectItem>
                                                    <SelectItem value="Сложная">
                                                        Сложная
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="image">
                                            URL изображения
                                        </Label>
                                        <Input
                                            id="image"
                                            value={newProduct.image}
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    image: e.target.value,
                                                })
                                            }
                                            placeholder="https://..."
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            МЕСТО ДЛЯ ЗАМЕНЫ: Укажите URL
                                            изображения товара
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleAddProduct}
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Сохранить товар
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Изображение</TableHead>
                                    <TableHead>Название</TableHead>
                                    <TableHead>Категория</TableHead>
                                    <TableHead>Цена</TableHead>
                                    <TableHead>Наличие</TableHead>
                                    <TableHead>Статус</TableHead>
                                    <TableHead>Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.slice(0, 10).map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                                                <ImageWithFallback
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {product.name}
                                        </TableCell>
                                        <TableCell>
                                            {product.category}
                                        </TableCell>
                                        <TableCell>{product.price} ₽</TableCell>
                                        <TableCell>
                                            {product.stock} шт
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {product.isNew && (
                                                    <Badge variant="secondary">
                                                        Новинка
                                                    </Badge>
                                                )}
                                                {product.isPopular && (
                                                    <Badge variant="secondary">
                                                        Популярное
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        toast.info(
                                                            "Редактирование (Demo)",
                                                        )
                                                    }
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        toast.info(
                                                            "Удаление (Demo)",
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Заметка */}
            <Card className="bg-muted">
                <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">
                        <strong>Demo режим:</strong> Все действия выполняются
                        локально и не сохраняются. В production версии данные
                        будут сохраняться в базе данных.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
