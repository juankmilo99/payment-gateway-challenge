# Payment Gateway Challenge 🚀

Aplicación Fullstack de Checkout para un solo producto, integrada a una pasarela de pagos (PSP) simulada en Sandbox. Este proyecto destaca por un enfoque estricto en UX/UI, validación en tiempo real y resiliencia.

## 🔗 Enlaces en Vivo (Producción)
- **Frontend (Aplicación Web):** [https://payment-gateway-test-juanc.netlify.app/](https://payment-gateway-test-juanc.netlify.app/)
- **Backend (Swagger API Docs):** [https://payment-gateway-challenge-bc.onrender.com/api/docs](https://payment-gateway-challenge-bc.onrender.com/api/docs)

## 🎯 Características Principales (UX/UI & Negocio)

- **Checkout de Alta Conversión:** SPA de 3 pasos (Producto, Pago, Resultado) con un diseño *premium* (modo oscuro, gradientes y animaciones sutiles).
- **Validación Reactiva (Real-Time):** Los campos sensibles como tarjeta de crédito y teléfono rechazan letras de inmediato y notifican si la tarjeta ingresada ya expiró.
- **Detección Dinámica de Tarjeta (Bonus):** El logotipo de **Visa** (iniciando con 4) o **Mastercard** (iniciando con 5) aparece dinámicamente según lo que digita el usuario.
- **Resiliencia al Refresh:** El estado del carrito (excepto datos sensibles de pago) se guarda usando `redux-persist`. Si el usuario recarga la página por accidente, no pierde sus datos.
- **Manejo de Servidores Inactivos (Cold Start):** Dado el *free tier* de Render, si el servidor está dormido, el Frontend ajusta dinámicamente sus *timeouts* e informa al usuario con un spinner amigable mientras el servidor despierta (hasta 45s).
- **Resultados de Pago Claros:** IDs de transacción truncados con botón interactivo de "Copiar al portapapeles", colores semánticos claros (Verde para éxito) y estructura limpia de grillas.

## 🏗️ Arquitectura y Tecnologías

### Backend (NestJS)
- **Arquitectura Hexagonal (Ports & Adapters)** combinada con **ROP (Railway Oriented Programming)** para control de flujos de pago robustos.
- **Base de Datos (Neon / PostgreSQL):** Gestionada con **Prisma ORM**. Los montos se manejan rigurosamente en *centavos* (Enteros) para evitar errores de precisión flotante.
- **Validación Fuerte:** DTOs interceptan peticiones API. Bloquean tarjetas con letras (`@IsNumberString()`) y garantizan longitud (`@Length()`).
- **Swagger UI:** Documentación interactiva autogenerada disponible en `/api/docs`.

### Frontend (React + Vite + Tailwind CSS)
- **Gestión de Estado:** Redux Toolkit.
- **Maquetación:** Tailwind CSS. Interfaz móvil responsive construida con *flexbox* y variables CSS para soporte rápido a temas personalizados.
- **Despliegue Configurado (Netlify):** `netlify.toml` preparado para rutear SPA (`/* -> /index.html`).

## 🚀 Guía de Ejecución Local

**Requisitos:** Node.js v20+, npm.

### 1. Levantar el Backend (NestJS)
```bash
cd backend
npm install
cp .env.example .env # Agrega tu DATABASE_URL de Neon
npx prisma generate
npx prisma db push
npm run prisma:seed # Sube los productos de prueba a la DB
npm run start
```

### 2. Levantar el Frontend (Vite)
```bash
cd frontend
npm install
cp .env.example .env # Asegura VITE_API_URL="http://localhost:3000"
npm run dev
```

## 🧪 Pruebas Unitarias (Test Coverage)

Ambas capas superan el **80% de cobertura** estipulado, ejecutadas con **Vitest**:
- **Backend:** `npm run test:cov` (>93% Global. Cubre Casos de Uso y Controladores).
- **Frontend:** `npx vitest run --coverage` (>81% Global. Cubre Store, Páginas Core y Componentes de UI).

## ☁️ Despliegue en Producción
- **Frontend:** Netlify. 
- **Backend:** Render (Web Service). Automático vía `render.yaml` (Infrastructure as Code).
