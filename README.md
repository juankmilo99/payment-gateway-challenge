# Payment Gateway Challenge 🚀

Aplicación Fullstack de Checkout de un producto con integración a pasarela de pagos (PSP) simulada en Sandbox. Este proyecto implementa las mejores prácticas arquitectónicas y de despliegue en capas gratuitas (Netlify y Render).

## 1. Descripción del Proyecto y Flujo de Negocio
Esta aplicación simula una tienda de un solo producto. El flujo consiste de 5 pantallas implementadas como una Single Page Application (SPA):
1. **Página de Producto:** Muestra el producto y su stock disponible.
2. **Formulario de Pago:** El usuario ingresa sus datos de contacto, envío y detalles de tarjeta de crédito (con detección visual de la marca).
3. **Resumen de Pago:** Overlay (*backdrop*) con desglose del precio, envíos y fees. 
4. **Estado de Transacción:** Pantalla que confirma si el pago fue aprobado, rechazado o fallido.
5. **Regreso:** El usuario puede volver al producto, cuyo stock ya ha sido actualizado en tiempo real.

**Características Destacadas:**
- **Resiliencia al Refresh:** Todo el estado del checkout (salvo datos sensibles) persiste usando `redux-persist`, por lo que si el usuario recarga la página a la mitad del formulario, no perderá su progreso.
- **Cold Start Handling:** Manejo de estado del servidor dormido (Render Free Tier) con *spinners* amigables y re-ajuste de *timeouts* en Axios.

## 2. Modelo de Datos (Relacional - PostgreSQL)
La base de datos (PostgreSQL en Neon) es gestionada mediante **Prisma ORM**.

- **Product:** `id`, `name`, `description`, `price` (centavos), `stock`.
- **Customer:** `id`, `email`, `fullName`, `phone`.
- **Transaction:** `id`, `status` (PENDING, APPROVED, REJECTED, ERROR), `amount`, `baseFee`, `deliveryFee`, `totalAmount`, `providerReference`, `productId`, `customerId`.
- **Delivery:** `id`, `transactionId`, `address`, `city`, `region`, `zipCode`, `status`.

> **Nota Financiera:** Los montos se guardan en la DB como *Enteros* (centavos) para prevenir los típicos problemas de precisión de punto flotante.

## 3. Arquitectura y Documentación de API
El backend (NestJS) está estructurado bajo **Arquitectura Hexagonal (Ports & Adapters)** combinado con **Railway Oriented Programming (ROP)** mediante una clase `Result<T, E>` para el flujo de la lógica de negocio sin usar excepciones como control de flujo.

- **Documentación Swagger:** Al levantar el backend, puedes visitar `http://localhost:3000/api/docs` para ver e interactuar con la documentación auto-generada de los endpoints.

## 4. Instalación y Ejecución Local

**Requisitos previos:** Node.js v20+, npm.

### Backend (NestJS)
1. Entra a la carpeta del backend: `cd backend`
2. Instala dependencias: `npm install`
3. Copia el entorno: `cp .env.example .env` (y agrega tu `DATABASE_URL` de Neon).
4. Genera los tipos de Prisma: `npx prisma generate`
5. Empuja el esquema a la DB y siembra los datos (seeding): 
   `npx prisma db push`
   `npm run prisma:seed`
6. Levanta el server: `npm run start`

### Frontend (React + Vite)
1. Entra a la carpeta frontend: `cd frontend`
2. Instala dependencias: `npm install`
3. Copia el entorno: `cp .env.example .env` (asegurándote de que `VITE_API_URL=http://localhost:3000`).
4. Levanta el server de desarrollo: `npm run dev`

## 5. Variables de Entorno

### `backend/.env`
```env
DATABASE_URL="postgresql://user:password@host/neon_db?sslmode=require"
PORT=3000
FRONTEND_URL="http://localhost:5173" # Cambiar por la URL de Netlify en prod
# Variables del PSP (Sandbox)
PSP_PUBLIC_KEY="pub_test_XXXX"
PSP_PRIVATE_KEY="prv_test_XXXX"
PSP_EVENTS_KEY="events_test_XXXX"
PSP_INTEGRITY_KEY="stagtest_integrity_XXXX"
```

### `frontend/.env`
```env
VITE_API_URL="http://localhost:3000" # URL del backend en Render en prod
```

## 6. Cobertura de Pruebas (Test Coverage)
La aplicación cuenta con pruebas unitarias tanto en backend como frontend, superando el objetivo del 80% gracias a `vitest`.

### Backend Coverage (>93%)
- **Componentes probados:** Casos de uso (ProcessPaymentUseCase), Controladores.
- **Resultado General:** 93.2% Statements | 77.5% Branch | 95.4% Funcs | 93.2% Lines.

### Frontend Coverage (>81% global)
- **Componentes probados:** Store completo, Componentes UI (CreditCardInput, Spinner, PaymentSummaryBackdrop), y las 3 Páginas principales (ProductPage, CheckoutPage, ResultPage).
- **Resultado General:** 82.35% Statements | 79.06% Branch | 75% Funcs | 81.37% Lines.

*(Para correrlos: `npm run test:cov` / `npx vitest run --coverage`)*

## 7. Despliegue (Deploy)

### Frontend (Netlify)
- El frontend está configurado para Netlify mediante el archivo `netlify.toml` ubicado en el directorio `/frontend`. 
- Este archivo enruta de manera segura todo el tráfico de SPA hacia `index.html` (para evitar errores 404 al recargar) y usa el build de Vite.

### Backend (Render - Web Service)
- Configurado vía `render.yaml` (Infrastructure as Code) en `/backend`.
- Ejecuta automáticamente `npm install`, `npx prisma generate` y compila con `npm run build`.
- Inicia con `node dist/main.js`.
- Se conecta a la base de datos de Neon de manera segura inyectando variables de entorno desde el dashboard.

## 8. ⚠️ Nota sobre Cold Start en Render
Dado que el Backend está desplegado en el *Free Tier* de Render, el servidor "se duerme" tras ~15 minutos de inactividad. **La primera petición para despertarlo puede tardar entre 40 y 50 segundos.**
- **Solución implementada:** Al cargar la app, el frontend intercepta la espera usando un timeout dinámico de 45s (sólo la primera vez). 
- Mientras tanto, el usuario ve en pantalla un spinner enriquecido que indica explícitamente: *"Estamos despertando el servidor, esto puede tardar unos segundos..."*. Una vez que despierta, el timeout vuelve a sus 15s regulares.
