# GreenPrint Backend

This is the backend server for the GreenPrint sustainability tracking application.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/greenprint
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

3. Build the TypeScript code:

```bash
npm run build
```

4. Start the development server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login user
- GET `/api/users/profile` - Get user profile
- PATCH `/api/users/profile` - Update user profile

### Goals

- GET `/api/goals` - Get all goals for a user
- POST `/api/goals` - Create a new goal
- PATCH `/api/goals/:id` - Update a goal
- DELETE `/api/goals/:id` - Delete a goal

### Actions

- GET `/api/actions` - Get all actions for a user
- POST `/api/actions` - Log a new action
- GET `/api/actions/stats` - Get action statistics
- DELETE `/api/actions/:id` - Delete an action

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript code
- `npm start` - Start production server
- `npm test` - Run tests

## Project Structure

```
src/
  ├── models/         # MongoDB models
  ├── routes/         # API routes
  ├── middleware/     # Custom middleware
  ├── utils/          # Utility functions
  └── index.ts        # Entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
