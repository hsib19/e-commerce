import { test, expect } from '@playwright/test';

test.describe('Next.js Ecommerce Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Pastikan Next.js sudah jalan di localhost:3000
        await page.goto('/');
    });

    test('add product to cart from catalogue', async ({ page }) => {

        const productCard = page.locator('[data-testid="card-product-1"]');
        await expect(productCard).toBeVisible();
        await productCard.click();

        await page.click('button:has-text("Add to Cart")');

        await page.waitForSelector('a:has-text("Proceed to Cart")', { state: 'visible', timeout: 5000 });
        await page.click('a:has-text("Proceed to Cart")');

        await expect(page).toHaveURL(/\/cart/);

    });

    test('add product to cart from search product', async ({ page }) => {

        const searchInputProduct = page.locator('[data-testid="search-product"]');
        await expect(searchInputProduct).toBeVisible();
        await searchInputProduct.fill("express");

        const dropdownListProduct = page.locator('[data-testid="option-product-list"]');
        await expect(dropdownListProduct).toBeVisible();

        const listOptionProduct = page.locator('[data-testid="product-option-list-1"]');
        await expect(listOptionProduct).toBeVisible();
        await listOptionProduct.click();

        await page.click('button:has-text("Add to Cart")');

        await page.waitForSelector('a:has-text("Proceed to Cart")', { state: 'visible', timeout: 5000 });
        await page.click('a:has-text("Proceed to Cart")');

        await expect(page).toHaveURL(/\/cart/);

    });

    test('increate, decrease, delete qty cart', async ({ page }) => {

        const productCard = page.locator('[data-testid="card-product-1"]');
        await expect(productCard).toBeVisible();
        await productCard.click();

        await page.click('button:has-text("Add to Cart")');

        const overlay = page.locator('[data-testid="overlay-cart"]');

        if (await overlay.isVisible()) {
            await overlay.click(); 
            await expect(overlay).toBeHidden();
        }

        await page.goto('/');

        const productCard2 = page.locator('[data-testid="card-product-2"]');
        await expect(productCard2).toBeVisible();
        await productCard2.click();

        await page.click('button:has-text("Add to Cart")');
        await page.click('a:has-text("Proceed to Cart")');

        await expect(page).toHaveURL(/\/cart/);

        await page.click('[data-testid="increase-qty-1"]');
        await page.click('[data-testid="decrease-qty-1"]');
        await page.click('[data-testid="remove-cart-1"]');

        await page.click('a:has-text("Proceed to Checkout")');
        await expect(page).toHaveURL(/\/checkout/);

        await page.fill('input[name="name"]', 'Hasib Muharam');
        await page.fill('input[name="email"]', 'hasibmuha@gmail.com');
        await page.fill('input[name="streetAddress"]', 'Jl budi mulya no 3');
        await page.fill('input[name="unitNumber"]', 'No 52');
        await page.fill('input[name="postalCode"]', '42110');

        await page.click('button:has-text("Proceed to Payment")');
        await expect(page).toHaveURL(/\/payment/);

        // Wait for the iframe element
        const iframeElementHandle = await page.waitForSelector('iframe[title="Secure payment input frame"]');

        // Get the Frame object from the iframe element handle
        const frame = await iframeElementHandle.contentFrame();
        if (!frame) throw new Error('Stripe iframe not found');

        await frame.locator('input[name="number"]').fill('4242 4242 4242 4242');
        // await stripeFrame.locator('input[name="exp-date"]').fill('12/34');
        // await stripeFrame.locator('input[name="cvc"]').fill('123');
        // await stripeFrame.locator('input[name="postal"]').fill('12345');


    });

});
