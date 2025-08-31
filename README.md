# Product Inventory Dashboard - Frontend

A modern **frontend** for the **Product Inventory Dashboard**, built with **Vite**, **React**, **TypeScript**, and **TailwindCSS**.  
It interacts with a Node.js backend to fetch and manage product data, supporting live charts, search, and role-based views.

## Features

### Admin
- View all products in a dashboard with charts and statistics
- Create, edit, and delete products
- Search products by name, category, or other fields
- View single product details

### User
- Browse all products
- View single product details
- No login required for viewing products

### General
- Fetch live data from backend API
- Display data visually using charts (sales, inventory, etc.)
- Responsive and modern UI with TailwindCSS
- Role-based UI rendering (Admin vs User)

## Tech Stack

- **Framework:** React (v18+) with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **State Management:** React Hooks / Context API
- **Charts & Visualization:** Chart.js / Recharts
- **HTTP Client:** Axios
- **Routing:** React Router
- **Authentication:** Integrated with backend JWT auth

## Installation

1. Clone the repository:

```bash
git clone https://github.com/alexrider187/product-inventory-frontend.git
cd product-inventory-frontend
