# Car Rental Frontend

This repository contains the frontend for a car rental application built with React, TypeScript, and Vite.

## Overview

The app provides:

- Multi-page car rental UI using React Router
- User authentication and session handling
- Admin management for cars
- Car search and filtering
- Rental checkout flow
- Language toggle for English and Thai

The frontend interacts with a local backend in `car-rental-backend/`.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router DOM
- ESLint

## Project Structure

- `src/`
  - `App.tsx` - main app routes and provider
  - `i18n.jsx` - language context and translation data
  - `components/` - reusable UI components
  - `Pages/` - screen-level pages
  - `services/api.js` - API client for backend requests
- `public/` - static assets
- `car-rental-backend/` - backend server and API

## Getting Started

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

```bash
cd car-rental-backend
npm install
cd ..
```

### 3. Run the backend server

```bash
cd car-rental-backend
npm run dev
```

If the backend runs successfully, it will listen on the configured port (default from `server.js`).

### 4. Run the frontend

```bash
npm run dev
```

Then open the local Vite URL provided in the terminal.

## Build

To build the frontend for production:

```bash
npm run build
```

## Linting

To run ESLint on the frontend codebase:

```bash
npm run lint
```

## Localization

The app provides a language switcher in the header. It toggles between:

- English
- Thai

Text translations are managed in `src/i18n.jsx`.

## Notes

- The frontend is configured as a Vite project with React and TypeScript support.
- The backend is a separate Express app under `car-rental-backend/`.
- Use the language toggle button in the navbar to switch translations across the app.

## License

This project is provided as-is.
