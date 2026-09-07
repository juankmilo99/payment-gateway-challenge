# Payment Gateway Challenge - Frontend

This is the frontend application for the Payment Gateway Challenge. It provides a modern, responsive, and secure onboarding flow for credit card payments.

## 🚀 Tech Stack

- **Framework:** [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language:** TypeScript
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Custom UI with Glassmorphism)
- **Testing:** [Jest](https://jestjs.io/) + React Testing Library

## ✨ Features

- **Mobile-first Design:** Fully responsive UI, prioritizing mobile UX.
- **Glassmorphism UI:** Modern aesthetics with blurred backdrops and gradient accents.
- **Dynamic Form Validation:** Real-time form validation and explicit required-field fallbacks.
- **Credit Card Formatting:** Visual indicators for card networks (e.g., Visa, Mastercard) based on BIN patterns.
- **Robust State Management:** Redux handles the checkout flow without exposing sensitive data in plain URLs.
- **High Test Coverage:** Over 90% unit test coverage simulating complete end-to-end user flows.

## 📦 Project Structure

```text
src/
├── components/
│   ├── checkout/    # Checkout specific components (e.g., PaymentSummaryBackdrop)
│   └── ui/          # Reusable UI components (e.g., CreditCardInput, Spinner)
├── pages/           # Application views (ProductPage, CheckoutPage, ResultPage)
├── services/        # API communication logic (Axios config)
├── store/           # Redux store and slices
├── index.css        # Global styles and CSS variables
└── main.tsx         # Application entry point
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Make sure `VITE_API_URL` points to your backend instance.*

### Running the App

Start the development server:
```bash
npm run dev
```

### Running Tests

Run the test suite with coverage report:
```bash
npm run test:cov
```

## ☁️ Deployment

This frontend is optimized for deployment on platforms like Netlify or Vercel. Continuous deployment is handled via the `main` branch.
