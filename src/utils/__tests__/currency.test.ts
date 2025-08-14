import { formatCurrency } from '../currency';

describe('formatCurrency', () => {
    it('formats amount to SGD by default', () => {
        expect(formatCurrency(1000)).toBe('$1,000.00');
    });

    it('formats amount with given locale and currency', () => {
        expect(formatCurrency(1000, 'de-DE', 'EUR')).toBe('1.000,00 €');
    });

    it('formats zero and negative amounts correctly', () => {
        expect(formatCurrency(0)).toBe('$0.00');
        expect(formatCurrency(-50)).toBe('-$50.00');
    });
});
