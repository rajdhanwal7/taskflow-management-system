# TaskFlow API

A production-quality backend API for TaskFlow Lite.

## Tech Stack

- Node.js
- Express.js
- CORS
- Morgan
- Helmet
- Express Rate Limit
- Zod (validation)

## Project Structure

```
taskflow-api/
├── server.js
├── package.json
├── .env
├── src/
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── security.js
│   │   ├── errorHandler.js
│   │   └── validateTask.js
│   └── utils/
│       └── responseHelper.js
├── tests/
│   └── TaskFlow.postman_collection.json
└── README.md
```

## API Endpoints

| Method | Endpoint          | Description           |
|--------|-------------------|-----------------------|
| GET    | /api/tasks        | Get all tasks         |
| GET    | /api/tasks/:id    | Get single task       |
| POST   | /api/tasks        | Create task           |
| PUT    | /api/tasks/:id    | Update task           |
| DELETE | /api/tasks/:id    | Delete task           |

## Data Model

```javascript
{
  id: number,
  text: string,
  completed: boolean,
  createdAt: string (ISO 8601)
}
```

## Installation & Setup

1. Navigate to the backend directory:
   ```bash
   cd taskflow-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. The API will be available at `http://localhost:3000`

## Postman Collection

Import the Postman collection from `tests/TaskFlow.postman_collection.json` to test the API endpoints.
