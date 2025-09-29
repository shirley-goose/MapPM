# PM Network - Product Manager Networking Platform

A web application MVP for connecting Product Managers across North America. Built with React, Node.js, MongoDB, and Auth0.

## Features

- 🔐 **Authentication**: Secure login with Auth0 (supports Google, LinkedIn, GitHub)
- 👤 **User Profiles**: Comprehensive PM-specific profile system with skills, experience, and interests
- 🗺️ **Interactive Map**: Connect with PMs in your area (Google Maps integration)
- 💬 **Community Forum**: Discussion boards for career advice, job market insights, and knowledge sharing
- 📚 **Resource Hub**: Curated PM learning materials, tools, and courses
- 🔗 **Smart Connections**: Connect with relevant PMs based on experience and interests
- 🛡️ **Privacy Controls**: Granular privacy settings for location and profile visibility

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Auth0 React SDK
- Google Maps JavaScript API
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express.js
- TypeScript
- MongoDB with Mongoose
- Auth0 JWT verification
- CORS enabled

### Deployment
- AWS Amplify (recommended for MVP)
- MongoDB Atlas (cloud database)

## Project Structure

```
/
├── client/                 # React frontend
│   ├── src/
│   │   ├── auth/          # Auth0 configuration
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # API utilities
│   │   └── types/         # TypeScript types
│   └── public/
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   └── types/         # TypeScript types
│   └── dist/              # Compiled JavaScript
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Auth0 account
- Google Maps API key

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd pm-network

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 2. Auth0 Configuration

1. Create an Auth0 account at [auth0.com](https://auth0.com)
2. Create a new Application (Single Page Application)
3. Configure the following settings:
   - **Allowed Callback URLs**: `http://localhost:3000`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
4. Create an API in Auth0:
   - **Name**: PM Network API
   - **Identifier**: `https://pm-network-api` (or your preferred identifier)
5. Note down:
   - Domain
   - Client ID
   - API Identifier

### 3. MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get the connection string

### 4. Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Maps JavaScript API
4. Create an API key
5. Restrict the key to Maps JavaScript API (recommended)

### 5. Environment Variables

#### Frontend (.env)
Create `client/.env`:

```env
REACT_APP_AUTH0_DOMAIN=your-auth0-domain.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
REACT_APP_AUTH0_AUDIENCE=https://pm-network-api
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

#### Backend (.env)
Create `server/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pm-network?retryWrites=true&w=majority

# Auth0
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_AUDIENCE=https://pm-network-api

# Google Maps
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 6. Run the Application

#### Development Mode

```bash
# Terminal 1: Start the backend
cd server
npm run dev

# Terminal 2: Start the frontend
cd client
npm start
```

#### Production Build

```bash
# Build frontend
cd client
npm run build

# Build and start backend
cd ../server
npm run build
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- API Health Check: `http://localhost:5000/api/health`

## User Profile Fields

The platform includes comprehensive PM-specific profile fields:

### Status Options
- Actively Job Seeking
- Currently Employed
- Open to Opportunities
- Hiring Manager

### Experience Levels
- Intern
- Associate PM (0-2 years)
- Product Manager (3-5 years)
- Senior PM (5-8 years)
- Principal PM (8+ years)
- Director+ (Leadership)

### PM Focus Areas
- Technical PM
- Growth PM
- Data PM
- AI/ML PM
- Platform PM
- Consumer PM
- B2B PM
- Product Operations

### Industries
- SaaS
- E-commerce
- Healthcare
- Fintech
- Gaming
- EdTech
- Crypto/Blockchain
- Hardware
- Media/Entertainment
- Real Estate

### Company Stages
- Pre-seed
- Seed
- Series A
- Series B
- Series C+
- Late Stage
- Public Company
- Established Enterprise

### Skills
- Strategy
- Analytics
- Technical
- Design
- Leadership
- Go-to-Market
- User Research
- Data Analysis

### Interests & Goals
- Mentoring
- Job Hunting
- Networking
- Knowledge Sharing
- Startup Founding
- Investing

## API Endpoints

### Authentication
All protected routes require a valid Auth0 JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

### User Endpoints
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/map` - Get users for map display (with privacy filters)
- `GET /api/users/search` - Search users with filters
- `GET /api/users/:id` - Get user by ID (public info only)

### Upcoming Endpoints
- Forum posts and comments
- Resource management
- Connection requests
- Real-time notifications

## Deployment to AWS

### Option 1: AWS Amplify (Recommended for MVP)

1. **Frontend Deployment**:
   ```bash
   # Install Amplify CLI
   npm install -g @aws-amplify/cli

   # Configure Amplify
   amplify configure
   amplify init
   amplify add hosting
   amplify publish
   ```

2. **Backend Deployment**:
   - Use Lambda functions with API Gateway
   - Set environment variables in Amplify Console
   - Configure custom domain

### Option 2: Elastic Beanstalk

1. **Frontend**: Deploy to S3 + CloudFront
2. **Backend**: Deploy to Elastic Beanstalk
3. **Database**: MongoDB Atlas (already cloud-hosted)

### Option 3: ECS with Fargate

1. Create Docker containers for frontend and backend
2. Deploy to ECS with Fargate
3. Use Application Load Balancer
4. Configure auto-scaling

## Cost Estimation (Monthly)

- **AWS Amplify**: $20-50 (hosting + Lambda usage)
- **MongoDB Atlas**: $9-25 (shared cluster M2/M5)
- **Auth0**: Free (up to 7,000 active users)
- **Google Maps API**: $200 credit included, then pay-per-use
- **Domain**: ~$12/year
- **Total**: ~$30-80/month for MVP

## Security Features

- JWT-based authentication with Auth0
- Input validation and sanitization
- Rate limiting on API endpoints
- HTTPS enforcement
- CORS properly configured
- Environment variables for secrets
- Privacy controls for user data
- Location data privacy (city-level accuracy)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues:
1. Check the existing GitHub issues
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

## Roadmap

### Phase 1 (Current) ✅
- [x] Authentication with Auth0
- [x] User profile system
- [x] Basic frontend structure
- [x] API foundation

### Phase 2 (Next)
- [ ] Google Maps integration
- [ ] Forum system
- [ ] Resource hub
- [ ] Connection system

### Phase 3 (Future)
- [ ] Real-time messaging
- [ ] Event calendar
- [ ] Job board integration
- [ ] Mobile app
- [ ] Advanced matching algorithms
- [ ] Mentorship program features