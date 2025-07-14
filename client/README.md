# Leaderboard Points System

A modern, full-stack leaderboard application built with React, TypeScript, Express.js, and MongoDB.

## Features

- **User Authentication**: Secure registration and login system
- **Point Management**: Claim random points (1-10) for users
- **Real-time Leaderboard**: Dynamic ranking with top 3 highlights
- **Point History**: Complete audit trail of all point claims
- **Responsive Design**: Mobile-friendly interface
- **Toast Notifications**: User feedback for all actions

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for development and building

### Backend
- Express.js with TypeScript support
- MongoDB with Mongoose ODM
- JWT authentication
- bcryptjs for password hashing
- Rate limiting and security middleware

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leaderboard-points-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/leaderboard_db
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Frontend URL for CORS
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # For local MongoDB installation
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

5. **Run the application**
   
   **Option 1: Run both frontend and backend together**
   ```bash
   npm run dev:full
   ```
   
   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Backend
   npm run dev:server
   
   # Terminal 2 - Frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (leaderboard)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (authenticated)

### Points
- `POST /api/points/claim` - Claim points for a user
- `GET /api/points/history` - Get point claim history
- `GET /api/points/history/:userId` - Get user's point history
- `GET /api/points/stats` - Get leaderboard statistics

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String (unique),
  email: String (unique),
  password: String (hashed),
  totalPoints: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Point Claims Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  points: Number (1-10),
  claimedBy: ObjectId (ref: User),
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet.js security headers
- Input validation and sanitization

## Development

### Project Structure
```
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── services/          # API service layer
│   └── ...
├── server/                # Backend Express application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Database configuration
│   └── server.js          # Main server file
└── ...
```

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run dev:server` - Start backend server
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.