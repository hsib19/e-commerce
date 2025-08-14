# ROLO Ecommerce

E-Commerce is an **Next.js + TypeScript** based ecommerce application with shopping cart, checkout, and **Stripe** payment integration.  
It includes testing with **Jest** and **Playwright**, plus **React Query** for data fetching.

## 🚀 Features

- **Frontend**
  - Built with [Next.js](https://nextjs.org/) & [React](https://react.dev/).
  - Styled with [Tailwind CSS](https://tailwindcss.com/).
  - Fully responsive design (mobile & desktop).
  - Reusable and modular components.

- **Backend**
  - Organized route structure inside `/api` folder
  - Handles product data, cart operations, and order processing
  
- **Ecommerce**
  - Shopping cart (add/update/delete quantity).
  - Automatic subtotal, discount, and total calculations.
  - Checkout page.
  - Online payment via [Stripe](https://stripe.com/).
  
- **Testing**
  - Unit & integration testing with [Jest](https://jestjs.io/).
  - End-to-end testing with [Playwright](https://playwright.dev/).

- **Other**
  - State management with Redux Toolkit.
  - API fetching with React Query.
  - Environment configuration via `.env.local` & `.env.production`.

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/hsib19/e-commerce.git
cd e-commerce
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file for development and `.env.production` for production.

```env
# Backend API URL
API_URL=http://localhost:5000

# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Google Sheets API
GOOGLE_SHEET_ID=your_google_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"


### 4. Run Development Server
```bash
npm run dev
```
The app will be running at: **http://localhost:3000**

---

## 🧪 Testing

### Unit & Integration Tests (Jest)
```bash
npm run test
```

### End-to-End Tests (Playwright)
```bash
npx playwright test
```
To open Playwright UI:
```bash
npx playwright test --ui
```

---

## 💳 Stripe Payment Flow

Checkout uses **Stripe Payment Element**:
1. The user selects a payment method.
2. On clicking **Pay**, the app calls `stripe.confirmPayment`.
3. Upon success, the order data is sent to the backend via `processPayment()`.

---

## 🛠 NPM Scripts

```bash
npm run dev       # Run development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run linting
npm run test      # Run Jest tests
npm run test:e2e  # Run Playwright tests
```
