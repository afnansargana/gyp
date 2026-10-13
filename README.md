
---

# AutoFixHub

AutoFixHub is a web application designed for an automotive service center. It allows customers to book appointments, order car parts, and track their service history. The platform also provides a dashboard for mechanics and admins to manage appointments, orders, and users.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **User Authentication:** Secure registration and login using JWT tokens.
- **Admin Panel:** Manage users, appointments, and orders.
- **Mechanic Dashboard:** View and update assigned appointments.
- **Order Management:** Customers can order car parts and track their orders.
- **Payment Integration:** Integrated with Stripe for secure payments.
- **Responsive Design:** Works on all devices (mobile, tablet, desktop).

## Tech Stack

### Frontend
- React.js, Tailwind CSS, Framer Motion
- Zustand, Axios, React Hook Form + Zod
- Socket.io-client, Recharts, Sonner

### Backend
- Node.js, Express.js, MongoDB / Mongoose
- JWT, Helmet, CORS, express-rate-limit, mongo-sanitize
- Socket.io, Stripe, PDFKit, Google Generative AI

## Installation

### Prerequisites

Ensure you have the following installed:
- Node.js
- MongoDB
- Stripe account (for payment integration)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/AutoFixHub.git
   cd AutoFixHub
   ```

2. **Install dependencies** (premium libraries are already listed in each `package.json`):

   ```bash
   cd backend
   npm install

   cd ../frontend
   npm install
   ```

   Libraries added for the production upgrade:
   - Frontend: `framer-motion`, `zustand`, `axios`, `react-hook-form`, `@hookform/resolvers`, `zod`, `socket.io-client`, `recharts`, `sonner`, `lucide-react`
   - Backend: `helmet`, `express-rate-limit`, `express-mongo-sanitize`, `socket.io`, `pdfkit`, `@google/generative-ai`

3. **Environment files**

   ```bash
   copy backend\.env.example backend\.env
   copy frontend\.env.example frontend\.env
   ```

4. **Start the development servers** (two terminals):

   ```bash
   cd backend
   npm start
   ```

   ```bash
   cd frontend
   npm start
   ```

   Frontend: `http://localhost:3001` · Backend API: `http://localhost:3000`

5. **MongoDB (do this last — everything else is already wired)**

   Auth, bookings, orders, invoices, and dashboards need MongoDB running on `127.0.0.1:27017`.

   **Option A — MongoDB as a Windows service**
   1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community).
   2. Open **PowerShell as Administrator** and run:
      ```powershell
      Start-Service MongoDB
      ```
   3. Restart the backend: `cd backend` then `npm start`.

   **Option B — Docker**
   ```powershell
   docker run -d -p 27017:27017 --name autofix-mongo mongo:6
   ```

   Confirm in the backend terminal: `Mongoose connected to mongodb://127.0.0.1:27017/...`

   Optional: set `GEMINI_API_KEY` in `backend/.env` for live Gemini diagnostics. Without it, the Symptom Analyzer still works with built-in mechanical rules.

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

See `backend/.env.example` and `frontend/.env.example`. Minimum backend values:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/autofixhub
JWT_SECRET=change-me-in-production
FRONTEND_URL=http://localhost:3001
```

## Usage

### User Workflow
1. **Sign Up / Login:** Users can create an account or log in using their credentials.
2. **Browse Parts:** Users can browse available car parts and add them to the cart.
3. **Checkout:** Users can proceed to checkout and make payments using Stripe.
4. **Book Appointments:** Users can book service appointments and choose a mechanic.
5. **Order Tracking:** Users can track their order status and view past orders.

### Admin Workflow
1. **Dashboard:** Admins can view and manage users, appointments, and orders.
2. **Assign Tasks:** Admins can assign appointments to mechanics.
3. **Order Management:** Admins can view and update order statuses.

### Mechanic Workflow
1. **View Assignments:** Mechanics can view appointments assigned to them.
2. **Update Status:** Mechanics can update the status of appointments.

## API Endpoints

### Authentication
- **POST /api/auth/register:** Register a new user.
- **POST /api/auth/login:** Login and receive a JWT token.

### Orders
- **POST /api/orders:** Create a new order.
- **GET /api/orders:** Get all orders (admin only).
- **GET /api/orders/:id:** Get order by ID.

### Appointments
- **POST /api/appointments:** Create a new appointment.
- **GET /api/appointments:** Get all appointments (admin and mechanic only).
- **GET /api/appointments/:id:** Get appointment by ID.

### Users
- **GET /api/users:** Get all users (admin only).
- **GET /api/users/:id:** Get user by ID.

### Products
- **GET /api/products:** Get all products.
- **GET /api/products/:id:** Get product by ID.

## File Structure

```
AutoFixHub/
├── backend/
│   ├── app.js
│   ├── conn/
│   ├── controllers/
│   ├── middleware/          # JWT + RBAC
│   ├── models/
│   ├── routes/
│   ├── services/            # OTP, email (AI / PDF / sockets next)
│   └── utils/
└── frontend/
    ├── public/
    ├── src/
    │   ├── app/
    │   │   ├── providers/   # AppProviders (toasts, cart)
    │   │   └── router/      # ProtectedRoute, RoleRoute
    │   ├── Components/
    │   │   ├── auth/        # Animated OTP input
    │   │   ├── layout/      # Public, Auth, shells
    │   │   ├── motion/      # FadeIn, Stagger, Magnetic, PageTransition
    │   │   ├── ui/          # Button, Input, Toast, Skeleton, Modal
    │   │   ├── Admin/
    │   │   └── Mechanic/
    │   ├── lib/
    │   │   ├── api/         # Axios client + auth API
    │   │   └── validations/ # Zod schemas
    │   ├── pages/auth/      # Login, Signup, Verify OTP
    │   ├── store/           # Zustand (auth, UI)
    │   ├── App.js
    │   └── index.css        # Design tokens
    └── tailwind.config.js
```

**Done in code:** design system, OTP auth, AI Symptom Analyzer, Socket.io notifications, analytics, PDF invoices, HttpOnly cookies + refresh rotation, Stripe webhook fulfillment.

**You still need locally:** start MongoDB (see Installation step 5). After that, the project is complete.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or suggestions, feel free to reach out:

- Email: [Mail me](mailto:ammarnazir864@gmail.com)
- LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/yourprofile)
- GitHub: [ GitHub Profile](https://github.com/AmmarNazir)

---

