import React from "react";
import { motion } from "motion/react";
import {
    Sparkles,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
} from "lucide-react";
import { Separator } from "@/app/components/ui/separator";

interface FooterProps {
    onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* О компании */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Sparkles className="w-6 h-6 text-purple-600" />
                            </motion.div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                                GameMagic
                            </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Магазин настольных игр с магической атмосферой. Мы
                            делаем каждую игру особенной!
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: Facebook, href: "#" },
                                { icon: Twitter, href: "#" },
                                { icon: Instagram, href: "#" },
                                { icon: Youtube, href: "#" },
                            ].map((social, idx) => (
                                <motion.a
                                    key={idx}
                                    href={social.href}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white"
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Навигация */}
                    <div>
                        <h4 className="font-semibold mb-4">Навигация</h4>
                        <ul className="space-y-2">
                            {[
                                {
                                    label: "Главная",
                                    page: "home",
                                    id: "nav-home",
                                },
                                {
                                    label: "Каталог",
                                    page: "catalog",
                                    id: "nav-catalog",
                                },
                                {
                                    label: "Новинки",
                                    page: "catalog",
                                    id: "nav-new",
                                },
                                {
                                    label: "Популярное",
                                    page: "catalog",
                                    id: "nav-popular",
                                },
                                {
                                    label: "Скидки",
                                    page: "catalog",
                                    id: "nav-sale",
                                },
                            ].map((link) => (
                                <li key={link.id}>
                                    <button
                                        onClick={() => onNavigate(link.page)}
                                        className="text-sm text-muted-foreground hover:text-purple-600 transition-colors"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Категории */}
                    <div>
                        <h4 className="font-semibold mb-4">Категории</h4>
                        <ul className="space-y-2">
                            {[
                                "Карточные игры",
                                "Семейные игры",
                                "Стратегические игры",
                                "Пазлы",
                                "Аксессуары",
                            ].map((category) => (
                                <li key={category}>
                                    <button
                                        onClick={() => onNavigate("catalog")}
                                        className="text-sm text-muted-foreground hover:text-purple-600 transition-colors"
                                    >
                                        {category}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Контакты */}
                    <div>
                        <h4 className="font-semibold mb-4">Контакты</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 text-purple-600" />
                                <span>Москва, ул. Игровая, д. 42</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4 text-purple-600" />
                                <a
                                    href="tel:+79991234567"
                                    className="hover:text-purple-600"
                                >
                                    +7 (999) 123-45-67
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4 text-purple-600" />
                                <a
                                    href="mailto:info@gamemagic.ru"
                                    className="hover:text-purple-600"
                                >
                                    info@gamemagic.ru
                                </a>
                            </li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-4">
                            Работаем ежедневно с 10:00 до 22:00
                        </p>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Нижняя часть */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        © {currentYear} GameMagic. Все права защищены.
                    </p>
                    <div className="flex gap-6">
                        <button className="text-sm text-muted-foreground hover:text-purple-600 transition-colors">
                            Политика конфиденциальности
                        </button>
                        <button className="text-sm text-muted-foreground hover:text-purple-600 transition-colors">
                            Условия использования
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};
