# FoodieHub

## Project overview

FoodieHub is a full-stack food delivery app with:

- `frontend/`: React 19 + Vite client
- `backend/`: Express API using MongoDB/Mongoose

## Running on Replit

The configured `Start application` workflow runs the frontend preview:

```bash
cd frontend && npm run dev -- --host 0.0.0.0 --port 5000
```

The frontend is available through the Replit Preview panel. The backend still requires a valid `MONGO_URI` environment variable before it can be started.

## User preferences

- Use SQL instead of MongoDB for the planned database migration.