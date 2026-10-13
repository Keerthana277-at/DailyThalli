# DailyThalli 🍽️

**A MERN Stack Application for Daily Meal and Order Management**

DailyThalli is a web application designed to simplify everyday meal management by organizing customers, menu items, orders, and payments in one place.

The application provides a centralized dashboard and helps users track orders, manage customer balances, and record payments through a clean, user-friendly interface.

## ✨ Features

- **Authentication:** Login and protected access to the dashboard.
- **Dashboard:** View key information about customers, menu items, orders, and payments.
- **Customer Management:** Add, view, update, and delete customer records.
- **Menu Management:** Manage menu items, prices, and availability.
- **Order Management:** Create orders, track order status, and view order amounts.
- **Payment Management:** Record payments using Cash, UPI, or Card.
- **Balance Tracking:** Track paid amounts and outstanding customer balances.
- **Responsive UI:** A consistent interface with a green-and-white visual theme.

## 🛠️ Tech Stack

### Frontend
- React
- JavaScript
- Vite
- CSS
- React Router
- Lucide React

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- Mongoose

### Authentication
- JSON Web Tokens (JWT)
- bcrypt password hashing

## 📁 Project Structure

```text
DailyThalli/
├── Client/
│   ├── src/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── ...
├── Server/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── app.js
│   ├── package.json
│   └── ...
└── README.md
```

*Note: The folder names above are illustrative. Adjust them if your actual project structure differs.*

## ⚙️ Prerequisites

Before running the application, install:

- Node.js and npm
- MongoDB Community Server, running locally
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd DailyThalli
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Configure the backend

```bash
cd Server
npm install
```

Create a `.env` file inside the `Server` directory with the configuration required by your backend.

Example:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/dailythali
JWT_SECRET=replace_with_a_strong_secret
```

Use the exact environment variable names expected by your existing backend code. Never commit your real `.env` file or JWT secret.

Start the backend using the start script defined in `Server/package.json`, for example:

```bash
npm start
```

### 3. Configure the frontend

Open a second terminal:

```bash
cd Client
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

### 4. Database setup

Ensure MongoDB is running locally before starting the backend. The application uses the `dailythali` database.

## 🔐 Security Notes

- Keep `.env` files and secrets out of version control.
- Use strong JWT secrets.
- Do not store plaintext passwords; passwords should be hashed before storage.
- Configure appropriate CORS settings and authentication middleware before deployment.

## 🌱 Future Improvements

- Add search, sorting, and filtering.
- Improve dashboard analytics and reporting.
- Add automated tests and stronger input validation.
- Deploy the frontend and backend.
- Add screenshots and a live demo link.

## 👩‍💻 About

DailyThalli is a full-stack development project built to practice React, Node.js, Express, MongoDB, REST APIs, authentication, and CRUD operations.

---

**Built with 💚 using the MERN stack.**
