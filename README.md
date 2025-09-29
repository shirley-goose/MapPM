# MapPM - Product Manager Networking Platform

A web application MVP for connecting Product Managers across North America. MapPM provides a platform for PMs to network, share experiences, find opportunities, and build meaningful professional connections.

## 🚀 Live Application
- **Frontend**: https://YOUR_CLOUDFRONT_DISTRIBUTION_ID.cloudfront.net
- **Authentication**: AWS Cognito hosted UI
- **Domain**: Custom domain integration pending

## 📋 Current Status: MVP Authentication Complete ✅

### ✅ Completed Features
- [x] **React.js Frontend** with TypeScript
- [x] **AWS Amplify Hosting** with CloudFront CDN
- [x] **AWS Cognito Authentication** (replaced Auth0)
- [x] **Responsive UI** with Tailwind CSS
- [x] **User Registration & Login** with email verification
- [x] **OAuth Flow** with proper callback handling
- [x] **Google Maps Integration** with interactive map
- [x] **User Location Markers** with sample PM data
- [x] **Map Controls** and search functionality
- [x] **Project Structure** for scalable development
- [x] **Deployment Pipeline** with AWS Amplify

### 🔧 Technical Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript (ready for deployment)
- **Database**: MongoDB Atlas (configured, not deployed)
- **Authentication**: AWS Cognito User Pools
- **Maps**: Google Maps JavaScript API
- **Hosting**: AWS Amplify + CloudFront
- **Infrastructure**: AWS (Lambda + API Gateway planned)

## 📁 Project Structure

```
map/
├── client/                          # React.js Frontend
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── Navbar.tsx          # Navigation with auth
│   │   │   ├── MainApp.tsx         # Main app router
│   │   │   ├── LoadingSpinner.tsx  # Loading component
│   │   │   └── ProfileSetup.tsx    # User profile setup
│   │   ├── pages/                  # Page components
│   │   │   ├── LandingPage.tsx     # Landing page
│   │   │   ├── Dashboard.tsx       # User dashboard
│   │   │   ├── MapView.tsx         # Map feature (placeholder)
│   │   │   ├── Forum.tsx           # Forum (placeholder)
│   │   │   ├── Resources.tsx       # Resources (placeholder)
│   │   │   └── Profile.tsx         # User profile
│   │   ├── hooks/
│   │   │   ├── useAuth.ts          # Authentication hook
│   │   │   └── useAPI.ts           # API integration hook
│   │   ├── utils/
│   │   │   └── api.ts              # API client with auth
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript types
│   │   ├── aws-exports.js          # Amplify configuration
│   │   └── amplifyconfiguration.json # Amplify config
│   ├── amplify/                    # Amplify backend config
│   ├── build/                      # Production build
│   ├── public/                     # Static assets
│   ├── package.json                # Dependencies
│   └── tailwind.config.js          # Tailwind configuration
│
├── server/                         # Express.js Backend (Not Deployed)
│   ├── src/
│   │   ├── controllers/            # API controllers
│   │   ├── models/                 # Database models
│   │   ├── routes/                 # API routes
│   │   ├── middleware/             # Custom middleware
│   │   └── utils/                  # Utility functions
│   ├── package.json                # Server dependencies
│   └── serverless.yml              # Serverless config
│
├── .git/                           # Git repository
├── .gitignore                      # Git ignore rules
├── amplify.yml                     # Amplify build config
├── deploy.sh                       # Deployment script
├── DEPLOYMENT.md                   # Deployment guide
├── AWS_CONSOLE_DEPLOYMENT.md       # AWS console setup
└── README.md                       # This file
```

## 🔐 Authentication Details

### User Pool Configuration
- **User Pool ID**: `us-east-1_pCVANYh4E`
- **Client ID**: `1g7njc2iv3qkb54fjcnskhlvms`
- **Domain**: `mappm767982c3-767982c3-mappm.auth.us-east-1.amazoncognito.com`
- **Authentication Flow**: Authorization Code Grant with PKCE
- **Verification**: Email-based with CAPTCHA challenges

### Registered Users
- **Active Users**: 1 verified account
- **Email Verification**: Enabled
- **MFA**: Disabled (can be enabled later)

## 🛠 Development Setup

### Prerequisites
- Node.js 18+ and npm
- AWS CLI configured
- Amplify CLI installed

### Environment Variables Setup
1. Copy the environment template:
   ```bash
   cp client/.env.example client/.env
   ```

2. Add your Google Maps API key to `client/.env`:
   ```bash
   REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key
   ```

### Frontend Setup
```bash
cd client/
npm install
npm start
```

### Backend Setup (Local Development)
```bash
cd server/
npm install
npm run dev
```

### Build & Deploy
```bash
cd client/
npm run build
amplify publish
```

## 🎯 Next Steps & Roadmap

### Phase 1: Core Backend API (Next Priority)
- [ ] **Deploy Express.js API** to AWS Lambda
- [ ] **Setup API Gateway** with custom domain
- [ ] **Connect MongoDB Atlas** database
- [ ] **Implement User Profile API**
  - GET/PUT `/api/users/me` - User profile management
  - POST `/api/users/profile-setup` - Complete profile setup
- [ ] **Test API with Frontend** integration

### Phase 2: Map Feature Implementation
- [ ] **Google Maps Integration**
  - Setup Google Maps API key
  - Implement interactive map component
  - Add user location markers
- [ ] **Location Services**
  - GET `/api/users/map` - Get users for map display
  - Privacy controls for location sharing
- [ ] **Search & Filter** functionality

### Phase 3: Forum System
- [ ] **Forum API Development**
  - POST/GET `/api/forum/posts` - Create and fetch posts
  - POST `/api/forum/posts/:id/comments` - Comment system
  - POST `/api/forum/posts/:id/vote` - Voting system
- [ ] **Forum Frontend**
  - Post creation interface
  - Comment threads
  - Category filtering (job-market, interview-prep, etc.)

### Phase 4: Resource Hub
- [ ] **Resource Management API**
  - GET/POST `/api/resources` - Resource CRUD
  - POST `/api/resources/:id/rate` - Rating system
- [ ] **Resource Frontend**
  - Resource browsing interface
  - Categories (courses, tools, templates, etc.)
  - Rating and review system

### Phase 5: Networking Features
- [ ] **Connection System**
  - POST `/api/connections/request` - Send connection requests
  - GET/PUT `/api/connections` - Manage connections
- [ ] **Messaging System** (basic)
- [ ] **Professional Matching** algorithm

### Phase 6: Production Enhancements
- [ ] **Custom Domain** setup
- [ ] **Advanced Search** and filtering
- [ ] **Email Notifications** system
- [ ] **Analytics** implementation
- [ ] **Performance** optimization
- [ ] **Mobile** responsiveness improvements

## 📊 Technical Debt & Improvements

### Code Quality
- [ ] Fix ESLint warnings in ProfileSetup component
- [ ] Add comprehensive error boundaries
- [ ] Implement proper loading states
- [ ] Add unit and integration tests

### Security & Performance
- [ ] Implement rate limiting
- [ ] Add input validation and sanitization
- [ ] Setup monitoring and logging
- [ ] Optimize bundle size and performance

### DevOps
- [ ] Setup CI/CD pipeline
- [ ] Environment-specific configurations
- [ ] Automated testing pipeline
- [ ] Backup and disaster recovery

## 🔧 Environment Variables

### Required for Full Deployment
```bash
# Google Maps API Key (get from Google Cloud Console)
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# MongoDB (for backend)
MONGODB_URI=your_mongodb_connection_string

# API Configuration
REACT_APP_API_URL=your_api_gateway_url
```

## 📞 Support & Documentation

- **AWS Console**: For managing Cognito users and infrastructure
- **Amplify Console**: For deployment status and logs
- **CloudFront**: For CDN and performance monitoring
- **MongoDB Atlas**: For database management (when deployed)

## 🏆 Achievement Summary

- ✅ **Full Authentication System** working with AWS Cognito
- ✅ **Production Deployment** on AWS with global CDN
- ✅ **Interactive Google Maps** with user markers and controls
- ✅ **Responsive Frontend** with modern React stack
- ✅ **Scalable Architecture** ready for feature expansion
- ✅ **Professional UI/UX** with Tailwind CSS
- ✅ **OAuth Integration** with proper callback handling

**Current MVP Status**: Authentication and Google Maps integration complete. Map shows sample Product Manager locations across North America with interactive markers and search functionality.

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

## API Endpoints (Planned)

### User Endpoints
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/map` - Get users for map display
- `GET /api/users/search` - Search users with filters
- `GET /api/users/:id` - Get user by ID

### Forum Endpoints
- `GET /api/forum/posts` - Get forum posts
- `POST /api/forum/posts` - Create new post
- `POST /api/forum/posts/:id/comments` - Add comment
- `POST /api/forum/posts/:id/vote` - Vote on post

### Resource Endpoints
- `GET /api/resources` - Get resources
- `POST /api/resources` - Create resource
- `POST /api/resources/:id/rate` - Rate resource

### Connection Endpoints
- `GET /api/connections` - Get connections
- `POST /api/connections/request` - Send connection request
- `PUT /api/connections/:id` - Accept/decline request

---

*Last Updated: September 29, 2025*
*Project Status: MVP Phase Complete - Ready for Backend Development*