import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
    Filter,
    X,
    SlidersHorizontal,
    Dices,
    Spade,
    Users,
    Crown,
    Puzzle,
    Target,
} from "lucide-react";
import { Product, Filters } from "@/types";
import { useApp } from "@/context/AppContext";
import { categories } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import { Slider } from "@/app/components/ui/slider";
import { Badge } from "@/app/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/app/components/ui/sheet";

// Маппинг иконок
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Dices,
    Spade,
    Users,
    Crown,
    Puzzle,
    Target,
};

interface CatalogPageProps {
    onNavigate: (page: string, productId?: string) => void;
    initialSearch?: string;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
    onNavigate,
    initialSearch = "",
}) => {
    const { products } = useApp();
    const [filters, setFilters] = useState<Filters>({
        search: initialSearch,
        priceRange: [0, 5000],
    });
    const [sortBy, setSortBy] = useState<string>("default");

    // Фильтрация товаров
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Поиск
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(searchLower) ||
                    p.description.toLowerCase().includes(searchLower) ||
                    p.category.toLowerCase().includes(searchLower),
            );
        }

        // Категория
        if (filters.category && filters.category !== "all") {
            const category = categories.find((c) => c.id === filters.category);
            if (category) {
                result = result.filter((p) => p.category === category.name);
            }
        }

        // Цена
        if (filters.priceRange) {
            result = result.filter(
                (p) =>
                    p.price >= filters.priceRange![0] &&
                    p.price <= filters.priceRange![1],
            );
        }

        // Количество игроков
        if (filters.players) {
            const [min, max] = filters.players.split("-").map(Number);
            result = result.filter(
                (p) => p.players.min >= min && p.players.max <= max,
            );
        }

        // Возраст
        if (filters.ageRating) {
            const age = Number(filters.ageRating);
            result = result.filter((p) => p.ageRating >= age);
        }

        // Длительность
        if (filters.duration) {
            const [min, max] = filters.duration.split("-").map(Number);
            result = result.filter(
                (p) => p.duration >= min && (!max || p.duration <= max),
            );
        }

        // Сложность
        if (filters.difficulty) {
            result = result.filter((p) => p.difficulty === filters.difficulty);
        }

        // Сортировка
        switch (sortBy) {
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                result.sort((a, b) => b.rating - a.rating);
                break;
            case "popular":
                result.sort((a, b) => b.reviews - a.reviews);
                break;
            case "new":
                result = result.filter((p) => p.isNew);
                break;
        }

        return result;
    }, [filters, sortBy]);

    const clearFilters = () => {
        setFilters({ priceRange: [0, 5000] });
        setSortBy("default");
    };

    const activeFiltersCount = Object.values(filters).filter(
        (v) => v && v !== "all",
    ).length;

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Поиск */}
            <div>
                <Label>Поиск</Label>
                <Input
                    placeholder="Название игры..."
                    value={filters.search || ""}
                    onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                    }
                />
            </div>

            {/* Категория */}
            <div>
                <Label>Категория</Label>
                <Select
                    value={filters.category || "all"}
                    onValueChange={(value) =>
                        setFilters({ ...filters, category: value })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Все категории" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => {
                            const IconComponent = iconMap[cat.icon] || Dices;
                            return (
                                <SelectItem key={cat.id} value={cat.id}>
                                    <span className="flex items-center gap-2">
                                        <IconComponent className="w-4 h-4" />
                                        {cat.name}
                                    </span>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            {/* Цена */}
            <div>
                <Label>
                    Цена: {filters.priceRange?.[0]} - {filters.priceRange?.[1]}{" "}
                    ₽
                </Label>
                <Slider
                    min={0}
                    max={5000}
                    step={100}
                    value={filters.priceRange || [0, 5000]}
                    onValueChange={(value) =>
                        setFilters({
                            ...filters,
                            priceRange: value as [number, number],
                        })
                    }
                    className="mt-2"
                />
            </div>

            {/* Количество игроков */}
            <div>
                <Label>Количество игроков</Label>
                <Select
                    value={filters.players || "all"}
                    onValueChange={(value) =>
                        setFilters({
                            ...filters,
                            players: value === "all" ? "" : value,
                        })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Не важно" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Не важно</SelectItem>
                        <SelectItem value="2-2">Для 2 игроков</SelectItem>
                        <SelectItem value="2-4">2-4 игрока</SelectItem>
                        <SelectItem value="2-6">2-6 игроков</SelectItem>
                        <SelectItem value="4-10">4-10 игроков</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Возраст */}
            <div>
                <Label>Возраст</Label>
                <Select
                    value={filters.ageRating || "all"}
                    onValueChange={(value) =>
                        setFilters({
                            ...filters,
                            ageRating: value === "all" ? "" : value,
                        })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Не важно" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Не важно</SelectItem>
                        <SelectItem value="6">6+</SelectItem>
                        <SelectItem value="8">8+</SelectItem>
                        <SelectItem value="10">10+</SelectItem>
                        <SelectItem value="12">12+</SelectItem>
                        <SelectItem value="14">14+</SelectItem>
                        <SelectItem value="16">16+</SelectItem>
                        <SelectItem value="18">18+</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Длительность */}
            <div>
                <Label>Длительность игры</Label>
                <Select
                    value={filters.duration || "all"}
                    onValueChange={(value) =>
                        setFilters({
                            ...filters,
                            duration: value === "all" ? "" : value,
                        })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Не важно" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Не важно</SelectItem>
                        <SelectItem value="0-30">До 30 минут</SelectItem>
                        <SelectItem value="30-60">30-60 минут</SelectItem>
                        <SelectItem value="60-120">1-2 часа</SelectItem>
                        <SelectItem value="120-999">Более 2 часов</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Сложность */}
            <div>
                <Label>Сложность</Label>
                <Select
                    value={filters.difficulty || "all"}
                    onValueChange={(value) =>
                        setFilters({
                            ...filters,
                            difficulty: value === "all" ? "" : value,
                        })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Не важно" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Не важно</SelectItem>
                        <SelectItem value="Легкая">Легкая</SelectItem>
                        <SelectItem value="Средняя">Средняя</SelectItem>
                        <SelectItem value="Сложная">Сложная</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button onClick={clearFilters} variant="outline" className="w-full">
                Сбросить фильтры
            </Button>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Заголовок */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-bold mb-2">Каталог игр</h1>
                <p className="text-muted-foreground">
                    Найдено товаров: {filteredProducts.length}
                </p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Фильтры (Desktop) */}
                <aside className="hidden lg:block w-64 space-y-6">
                    <div className="sticky top-24">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                Фильтры
                            </h2>
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </div>
                        <FilterContent />
                    </div>
                </aside>

                {/* Основной контент */}
                <div className="flex-1">
                    {/* Панель управления */}
                    <div className="flex items-center justify-between mb-6 gap-4">
                        {/* Фильтры (Mobile) */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="lg:hidden">
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    Фильтры
                                    {activeFiltersCount > 0 && (
                                        <Badge className="ml-2">
                                            {activeFiltersCount}
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetHeader>
                                    <SheetTitle>Фильтры</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6">
                                    <FilterContent />
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Сортировка */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Сортировка" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">
                                    По умолчанию
                                </SelectItem>
                                <SelectItem value="price-asc">
                                    Цена: по возрастанию
                                </SelectItem>
                                <SelectItem value="price-desc">
                                    Цена: по убыванию
                                </SelectItem>
                                <SelectItem value="rating">
                                    По рейтингу
                                </SelectItem>
                                <SelectItem value="popular">
                                    По популярности
                                </SelectItem>
                                <SelectItem value="new">Новинки</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Товары */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map((product, idx) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
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
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <X className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-xl font-semibold mb-2">
                                Ничего не найдено
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Попробуйте изменить параметры фильтрации
                            </p>
                            <Button onClick={clearFilters}>
                                Сбросить фильтры
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
