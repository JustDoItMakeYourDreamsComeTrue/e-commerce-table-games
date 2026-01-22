import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Mail, Lock, User } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import { toast } from "sonner";

interface LoginPageProps {
    onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
    const { login, register } = useApp();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Заполните все поля");
            return;
        }

        if (!isLogin && !name) {
            toast.error("Введите ваше имя");
            return;
        }

        try {
            if (isLogin) {
                const user = await login(email, password);
                if (user) {
                    toast.success(`Добро пожаловать, ${user.name}!`);
                    onNavigate("home");
                } else {
                    toast.error("Неверный email или пароль");
                }
            } else {
                const user = await register(email, password, name);
                if (user) {
                    toast.success(
                        `Аккаунт создан! Добро пожаловать, ${user.name}!`,
                    );
                    onNavigate("home");
                } else {
                    toast.error("Пользователь с таким email уже существует");
                }
            }
        } catch (error) {
            toast.error("Произошла ошибка. Попробуйте снова.");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Card>
                    <CardHeader className="text-center">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mx-auto mb-4"
                        >
                            <Sparkles className="w-16 h-16 text-purple-600" />
                        </motion.div>
                        <CardTitle className="text-3xl">
                            {isLogin ? "Вход в аккаунт" : "Регистрация"}
                        </CardTitle>
                        <CardDescription>
                            {isLogin
                                ? "Войдите, чтобы получить доступ к функциям"
                                : "Создайте аккаунт для доступа к функциям"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="name">Имя</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Ваше имя"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Используйте email с "admin" для доступа к
                                    админ-панели
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Пароль</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                {isLogin ? "Войти" : "Зарегистрироваться"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-sm text-purple-600 hover:underline"
                            >
                                {isLogin
                                    ? "Нет аккаунта? Зарегистрироваться"
                                    : "Уже есть аккаунт? Войти"}
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground text-center">
                                {isLogin ? (
                                    <>
                                        <strong>Вход:</strong> Введите email и
                                        пароль зарегистрированного пользователя.
                                        <br />
                                        Для доступа к админ-панели используйте
                                        email с "admin" (например:
                                        admin@test.com)
                                    </>
                                ) : (
                                    <>
                                        <strong>Регистрация:</strong> Создайте
                                        новый аккаунт, указав имя, email и
                                        пароль.
                                        <br />
                                        Email с "admin" получит права
                                        администратора.
                                    </>
                                )}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};
