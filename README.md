# Payment Gateway Challenge 🚀

Aplicación Fullstack de Checkout integrada a una pasarela de pagos (PSP) simulada. Construida con un enfoque estricto en **UX/UI premium**, **validaciones rigurosas**, **seguridad** y **testing con Jest**.

## 🔗 Enlaces de Producción

- **Frontend (Aplicación Web):** [https://payment-gateway-test-juanc.netlify.app/](https://payment-gateway-test-juanc.netlify.app/)
- **Backend (Swagger API Docs):** [https://payment-gateway-challenge-bc.onrender.com/api/docs](https://payment-gateway-challenge-bc.onrender.com/api/docs)

## ✨ Características Principales

- **Flujo de 5 Pasos (5-step business process):** Sigue estrictamente el flujo requerido: `Product page -> Credit Card/Delivery info -> Summary -> Final status -> Product page`.
- **Diseño Premium y Resiliente:** Temática oscura, variables CSS personalizables y estado persistente ante recargas accidentales (`redux-persist`).
- **Validación Avanzada:** Filtra letras en campos numéricos en tiempo real, notifica expiración de tarjeta y usa DTOs estrictos en el backend.
- **Logo Dinámico (Bonus):** El logo de **Visa** o **Mastercard** se actualiza dinámicamente según los dígitos de la tarjeta introducidos.
- **Cold Start Handle:** Ajuste de timeouts y UI interactiva mientras el backend en *free-tier* despierta.

## 🛡️ Seguridad y OWASP (Bonus)

- **Helmet & CORS:** Cabeceras HTTP seguras configuradas mediante `helmet` y políticas de CORS restrictivas en el backend.
- **Sanitización de Datos:** No se almacenan ni registran en logs los datos sensibles de tarjetas (CVC, número completo). El frontend limpia los inputs numéricos contra inyección.
- **Protección de Precisión:** Uso estricto de enteros (centavos) para evitar vulnerabilidades de truncamiento flotante.

## 🗄️ Modelo de Datos (Data Model Design)

La base de datos relacional (PostgreSQL) está estructurada en 4 tablas principales:

- **Product:** Catálogo (id, name, description, price, stock, imageUrl).
- **Customer:** Datos del cliente (id, email, fullName, phone).
- **Delivery:** Información de envío (id, address, city, region, zipCode).
- **Transaction:** Registro transaccional central. Relaciona 1:1 con *Customer* y *Delivery*, y N:1 con *Product*. Almacena el `status` (APPROVED/REJECTED), el monto (`totalAmount`) y la referencia del proveedor (`providerReference`).

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React, Vite, Tailwind CSS, Redux Toolkit.
- **Backend:** NestJS, Prisma ORM, PostgreSQL (Neon).
- **Testing:** Jest + Testing Library.

## 🚀 Guía Rápida Local

### Variables de Entorno (.env)

Antes de ejecutar, asegúrate de crear los archivos `.env` basándote en `.env.example`:

**Backend:**
- `DATABASE_URL`: Connection string de PostgreSQL (Neon).
- `PORT`: Puerto del servidor (ej. 3000).
- `FRONTEND_URL`: URL permitida por CORS (ej. http://localhost:5173).
- `PSP_PUBLIC_KEY`: Llave pública del proveedor de pagos.
- `PSP_PRIVATE_KEY`: Llave privada del proveedor de pagos.
- `PSP_EVENTS_KEY`: Llave para eventos webhooks del PSP.
- `PSP_INTEGRITY_KEY`: Secreto usado para firmas transaccionales (se usa exclusivamente en el backend).

**Frontend:**
- `VITE_API_URL`: URL del backend (ej. http://localhost:3000).

### 1. Levantar el Backend (NestJS)
```bash
cd backend
npm install
cp .env.example .env # Configura las variables mencionadas
npx prisma generate && npx prisma migrate deploy
npm run prisma:seed  # Crea productos iniciales
npm run start
```

### 2. Levantar el Frontend (Vite)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 🧪 Pruebas Unitarias (Jest)

Ambas capas cumplen el **>80% de cobertura**, ejecutadas 100% con **Jest**:
- **Backend:** `npm run test:cov` (Cubre Casos de Uso y Controladores).
- **Frontend:** `npm run test:cov` (Cubre Store, Páginas y Validaciones).
