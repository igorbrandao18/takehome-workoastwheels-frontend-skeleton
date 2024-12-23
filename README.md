# How to Run the System

## Requirements

- Node.js v22.11.0
- npm (included with Node.js)

## Backend

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma migrate reset --force
```

3. Start the server:
```bash
npm run server
```
Server will be running at http://localhost:3000

## Frontend

1. In another terminal, start the frontend:
```bash
npm run dev
```
Application will be available at http://localhost:5173

## Features

- View available vehicles
- Filter by make, classification, and price
- View vehicle details
- Make reservations
- View reservation history 