## Dishant Nakrani - dishantnakrani410@gmail.com
## Divy Kalathiya - divykalathiya17@gmail.com
## Smit Satani - smitsatani07@gmail.com
## Krish Kakadiya - krishkakadiya000007@gmail.com


# Skill Swap Platform

A modern web application that enables users to list their skills and request others in return. Built with React, Node.js, and MongoDB.

## Features

### User Features
- **User Authentication**: Register, login, and profile management
- **Skill Management**: List skills offered and wanted
- **User Search**: Browse and search users by skills
- **Swap Requests**: Send, accept, reject, and cancel swap requests
- **Profile Management**: Update profile information and privacy settings
- **Feedback System**: Rate and review completed swaps

### Admin Features
- **User Management**: View all users, ban/unban users
- **Activity Monitoring**: Track platform activity and user actions
- **Statistics Dashboard**: View platform statistics and reports
- **Content Moderation**: Monitor and manage inappropriate content

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React** with Vite
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Sonner** for toast notifications

## Project Structure

```
Skill Swap Platform/
├── Backend/
│   ├── controllers/     # API controllers
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── middlewares/    # Authentication & admin middleware
│   ├── db/            # Database connection
│   └── index.js       # Server entry point
├── Frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── redux/      # Redux store and slices
│   │   └── App.jsx     # Main app component
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the development server:
```bash
npm run dev
```

The backend will be running on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/v1/user/register` - Register new user
- `POST /api/v1/user/login` - User login
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile

### User Management
- `GET /api/v1/user/public` - Get all public users
- `GET /api/v1/user/search` - Search users by skill
- `GET /api/v1/user/all` - Get all users (admin only)

### Swap Requests
- `POST /api/v1/swap/create` - Create swap request
- `PUT /api/v1/swap/accept/:requestId` - Accept swap request
- `PUT /api/v1/swap/reject/:requestId` - Reject swap request
- `PUT /api/v1/swap/cancel/:requestId` - Cancel swap request
- `GET /api/v1/swap/my-requests` - Get user's swap requests

### Feedback
- `POST /api/v1/feedback/create` - Create feedback
- `GET /api/v1/feedback/my-feedback` - Get user's feedback
- `GET /api/v1/feedback/user/:userId` - Get feedback for specific user

### Admin (Admin only)
- `GET /api/v1/admin/stats` - Get platform statistics
- `GET /api/v1/admin/activity-logs` - Get activity logs
- `PUT /api/v1/user/ban/:userId` - Ban user
- `PUT /api/v1/user/unban/:userId` - Unban user

## Database Models

### User
- Basic info (name, email, password)
- Location (optional)
- Profile photo (optional)
- Skills offered and wanted
- Availability
- Privacy settings
- Admin status

### SwapRequest
- From and to users
- Skills offered and wanted
- Status (pending, accepted, rejected, cancelled)
- Timestamps

### Feedback
- Swap reference
- Rating (1-5)
- Comment
- From and to users

### ActivityLog
- User actions
- Target users
- Action details
- Timestamps

## Features in Detail

### User Registration & Authentication
- Secure password hashing with bcryptjs
- JWT token-based authentication
- Profile photo support
- Email uniqueness validation

### Skill Management
- Users can list multiple skills they offer
- Users can specify skills they want to learn
- Skills are searchable and filterable
- Public/private profile settings

### Swap Request System
- Send swap requests to other users
- Accept or reject incoming requests
- Cancel pending requests
- Track request status and history

### Admin Dashboard
- View all platform users
- Ban/unban users for policy violations
- Monitor platform activity
- View platform statistics
- Track user actions and content

### Modern UI/UX
- Responsive design with Tailwind CSS
- Real-time notifications with toast messages
- Loading states and error handling
- Clean and intuitive interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository. 
