# 🌿 GreenCart - Local Sustainable Marketplace

A full-stack eco-commerce platform built with MERN stack that promotes sustainable living by connecting local sellers offering organic, handmade, or recycled products with conscious buyers.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)

---

## 🎯 Project Overview

GreenCart is an eco-friendly marketplace that enables sustainable commerce by:
- Connecting local sellers with environmentally conscious buyers
- Promoting organic, handmade, and recycled products
- Building community trust through verified reviews and ratings
- Supporting small businesses and local artisans

---

## ✨ Features

### Authentication & Authorization
- Email Verification with OTP using Nodemailer
- JWT-based secure authentication
- Role-Based Access Control (Buyer, Seller, Admin)
- Profile Management with bio, location, and contact details

### Product Management
- Product Listings with images, descriptions, and tags
- Cloudinary integration for image uploads
- Search and Filter by category, tags, and price range
- Comprehensive product detail pages

### Shopping Experience
- Shopping Cart with add, update, and remove functionality
- Multi-Step Checkout process
- Order Management and tracking
- Order Cancellation with automatic stock restoration

### Payment System
- Multiple Payment Methods (Card, PayPal, Cash on Delivery)
- Secure payment processing interface
- Order confirmation and summaries

### Review & Rating System
- Product Reviews with ratings
- Seller Ratings aggregated from all reviews
- Verified Purchase badges
- Website Feedback section on About page

### Seller Features
- Detailed Seller Profiles with contact information
- Product Management dashboard
- Sales Tracking and statistics
- Seller ratings and reviews

### Additional Features
- Responsive Design for mobile devices
- Custom Toast Notifications
- About and Contact Pages
- Community Feedback system

---

## 🛠️ Tech Stack

### Frontend
- React.js - UI library
- React Router - Client-side routing
- Axios - HTTP client
- CSS3 - Styling

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - NoSQL database
- Mongoose - ODM for MongoDB

### Additional Technologies
- JWT - Authentication tokens
- Bcrypt.js - Password hashing
- Nodemailer - Email service
- Cloudinary - Image storage
- Multer - File upload handling
- CORS - Cross-origin resource sharing

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Gmail account (for email service)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GreenCart
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:
```
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=6969
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in the client directory:
```
VITE_API_URL=http://localhost:6969
```

Start the development server:
```bash
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:6969

---

## 🔑 Environment Variables

### Backend
- `MONGO_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port number
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `EMAIL_USER` - Gmail address for sending emails
- `EMAIL_PASS` - Gmail app password
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend
- `VITE_API_URL` - Backend API URL

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/verify-otp` - Verify email with OTP
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/login` - User login
- `PUT /api/auth/update-profile` - Update user profile
- `GET /api/auth/user/:userId` - Get user profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (seller only)
- `PUT /api/products/:id` - Update product (seller only)
- `DELETE /api/products/:id` - Delete product (seller only)
- `GET /api/products/seller/:sellerId` - Get products by seller

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/cancel` - Cancel order

### Reviews
- `POST /api/reviews` - Add product review
- `GET /api/reviews/product/:productId` - Get product reviews
- `GET /api/reviews/seller/:sellerId` - Get seller reviews
- `DELETE /api/reviews/:id` - Delete review

### Website Feedback
- `GET /api/feedback/approved` - Get approved feedback
- `POST /api/feedback` - Submit feedback
- `PUT /api/feedback` - Update feedback
- `DELETE /api/feedback` - Delete feedback

---

## 🗄️ Database Schema

### User Model
- name, email, password (hashed)
- role (buyer/seller/admin)
- bio, profilePic, location, address, phone
- rating, totalRatings, totalSales
- memberSince, isEmailVerified

### Product Model
- name, description, price, category
- tags, images, stock
- seller (ref: User)
- rating, totalRatings

### Order Model
- user (ref: User)
- items (product, quantity, price, reviewed)
- totalAmount, shippingAddress
- paymentMethod, status

### Review Model
- product (ref: Product)
- seller (ref: User)
- user (ref: User)
- order (ref: Order)
- rating (1-5), comment, verified

---

## 📝 License

This project is created for educational purposes as part of a Node.js practical assignment.
Team members are :
Krish
Tarun
Aryan
Yuvraj

---

**Made with ❤️ for a greener tomorrow**
