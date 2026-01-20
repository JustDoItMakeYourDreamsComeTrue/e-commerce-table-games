export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
    }).format(price);
};

export const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(dateObj);
};

export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

export const calculateDiscount = (
    originalPrice: number,
    currentPrice: number,
): number => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const pluralize = (
    count: number,
    forms: [string, string, string],
): string => {
    const cases = [2, 0, 1, 1, 1, 2];
    return forms[
        count % 100 > 4 && count % 100 < 20
            ? 2
            : cases[count % 10 < 5 ? count % 10 : 5]
    ];
};
