# Fleet Control Pro - Backend

This directory contains the Node.js backend for the Fleet Control Pro application.

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- A running PostgreSQL database (e.g., from [Neon DB](https://neon.tech/))

### 2. Installation

Navigate into the `server` directory and install the dependencies:

```bash
cd server
npm install
```

### 3. Environment Configuration

1.  Create a `.env` file in the `server` directory by copying the example file:

    ```bash
    cp .env.sample .env
    ```

2.  Open the newly created `.env` file and replace the placeholder value with your actual PostgreSQL database connection string.

    For Neon DB, your connection string will look something like this:
    `DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"`

### 4. Running the Server

-   **For development (with auto-restarting on file changes):**

    ```bash
    npm run dev
    ```

-   **For production:**

    ```bash
    npm start
    ```

The server will start on `http://localhost:3001`.

## ✨ Features

-   **Automatic Table Creation**: On the first run, the server will automatically connect to your database and create the necessary `TruckLogs` and `Expenses` tables.
-   **Database Seeding**: If the tables are empty, the server will populate them with some initial sample data so you can see the application in action right away.
-   **REST API**: Provides endpoints for the frontend to create, read, and delete fleet data.
