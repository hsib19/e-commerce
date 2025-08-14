export function formatCurrency(amount: number, locale = 'en-SG', currency = 'SGD'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount);
}
