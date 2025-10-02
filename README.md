# MapPM - Product Manager Networking Platform

A web application for connecting Product Managers across North America. MapPM provides a platform for PMs to network, share experiences, find opportunities, and build meaningful professional connections.

## 🚀 Live Application

**Production URL**: https://YOUR_CLOUDFRONT_DISTRIBUTION_ID.cloudfront.net/

## ✨ Features

- **User Authentication** - AWS Cognito with OAuth 2.0
- **User Profiles** - Comprehensive PM-specific profile creation and editing
- **Interactive Map** - Google Maps integration showing PM locations across North America
- **Forum System** - Community discussions with posts, comments, and voting
- **Resources Hub** - Share and discover PM tools, courses, and templates
- **Real-time Data** - Supabase PostgreSQL database with Row Level Security

## 🏗 Architecture

### Frontend
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Context API
- **Routing**: React Router v6
- **Maps**: Google Maps JavaScript API
- **Authentication**: AWS Amplify + Cognito
- **Hosting**: AWS CloudFront CDN

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: AWS Cognito User Pools
- **API Layer**: Direct Supabase client (serverless)
- **Storage**: Supabase Storage (for forum and profile)

### Infrastructure
- **CDN**: AWS CloudFront
- **DNS**: CloudFront distribution
- **Database**: Supabase hosted PostgreSQL
- **Auth**: AWS Cognito User Pool (`us-east-1_pCVANYh4E`)

## 📋 Project Structure

```
map/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── Navbar.tsx          # Navigation with auth
│   │   │   ├── MainApp.tsx         # Main app router
│   │   │   └── ProfileSetup.tsx    # User profile setup
│   │   ├── pages/                  # Page components
│   │   │   ├── MapView.tsx         # Interactive map
│   │   │   ├── Forum.tsx           # Community forum
│   │   │   ├── Resources.tsx       # Resource hub
│   │   │   └── Profile.tsx         # User profile
│   │   ├── hooks/
│   │   │   └── useAuth.ts          # Authentication hook
│   │   ├── utils/
│   │   │   └── api.ts              # Supabase API client
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript types
│   │   ├── supabaseClient.ts       # Supabase initialization
│   │   └── amplifyconfiguration.json
│   ├── build/                      # Production build
│   ├── public/                     # Static assets
│   └── package.json
├── supabase_final_schema.sql       # Database schema
├── fix_users_rls.sql               # RLS policy fixes
├── icon.png                        # Logo icon
├── MapPM_words.png                 # Logo text asset
└── README.md                       # This file
```

## 🛠 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- AWS account (for Cognito)
- Supabase account (for database)
- Google Cloud account (for Maps API)

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd map/client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the `client/` directory:

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Maps API
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 4. Database Setup

Run the SQL schemas in your Supabase SQL Editor:

1. First, run `supabase_final_schema.sql` to create tables:
   ```sql
   -- Creates: users, forum_posts, forum_comments, resources, etc.
   ```

2. Then, run `fix_users_rls.sql` to configure Row Level Security:
   ```sql
   -- Sets up permissive RLS policies for authenticated users
   ```

### 5. AWS Cognito Setup

Configure AWS Amplify with your Cognito User Pool:

Edit `client/src/amplifyconfiguration.json`:
```json
{
  "Auth": {
    "Cognito": {
      "userPoolId": "your-user-pool-id",
      "userPoolClientId": "your-client-id",
      "signUpVerificationMethod": "code",
      "loginWith": {
        "oauth": {
          "domain": "your-cognito-domain.auth.us-east-1.amazoncognito.com",
          "scopes": ["email", "openid"],
          "redirectSignIn": ["http://localhost:3000/", "https://your-cloudfront-url.cloudfront.net/"],
          "redirectSignOut": ["http://localhost:3000/", "https://your-cloudfront-url.cloudfront.net/"],
          "responseType": "code"
        }
      }
    }
  }
}
```

### 6. Run Development Server

```bash
npm start
```

The app will open at http://localhost:3000

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deploy to AWS CloudFront

1. **Upload build files to S3**:
   ```bash
   aws s3 sync build/ s3://your-bucket-name --delete
   ```

2. **Invalidate CloudFront cache**:
   ```bash
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

3. **Update Cognito redirect URLs**:
   - Go to AWS Cognito Console
   - Navigate to your User Pool → App Clients
   - Add your CloudFront URL to Allowed callback URLs and sign-out URLs

## 📊 Database Schema

### Users Table
```sql
users (
  id UUID PRIMARY KEY,
  cognito_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  status TEXT,
  experience TEXT,
  pm_focus TEXT[],
  industry TEXT[],
  company_stage TEXT[],
  skills TEXT[],
  interests TEXT[],
  location JSONB,
  privacy JSONB,
  is_profile_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Forum Posts Table
```sql
forum_posts (
  id UUID PRIMARY KEY,
  author_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Forum Comments Table
```sql
forum_comments (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id),
  author_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP
)
```

### Resources Table
```sql
resources (
  id UUID PRIMARY KEY,
  author_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  rating_sum INTEGER DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP
)
```

## 🔐 Authentication Flow

1. User clicks "Sign In" → Redirected to AWS Cognito Hosted UI
2. User authenticates with email/password or social providers
3. Cognito redirects back with authorization code
4. Amplify exchanges code for tokens
5. Frontend stores session and user info
6. API calls include Cognito user ID (`cognito_id`) for database queries

## 🎨 User Profile Fields

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
- SaaS, E-commerce, Healthcare, Fintech, Gaming, EdTech, Crypto/Blockchain, Hardware, Media/Entertainment, Real Estate

### Company Stages
- Pre-seed, Seed, Series A, Series B, Series C+, Late Stage, Public Company, Established Enterprise

### Skills
- Strategy, Analytics, Technical, Design, Leadership, Go-to-Market, User Research, Data Analysis

### Interests & Goals
- Mentoring, Job Hunting, Networking, Knowledge Sharing, Startup Founding, Investing

## 🔧 Key Technical Decisions

### Why Supabase over MongoDB?
- **PostgreSQL**: More robust relational data model for user profiles and connections
- **Row Level Security**: Built-in fine-grained access control
- **Real-time**: Native support for real-time subscriptions
- **Storage**: Integrated file storage for avatars
- **Cost**: Generous free tier for MVP

### Why Direct Supabase Connection (No Backend Server)?
- **Simplicity**: Fewer moving parts, easier deployment
- **Cost**: No server hosting costs
- **Performance**: Reduced latency (no intermediate server)
- **Scalability**: Supabase handles connection pooling
- **Fallback**: localStorage fallback for offline development

### API Architecture
The app uses a dual-layer approach:
1. **Primary**: Direct Supabase client from frontend
2. **Fallback**: localStorage for offline/development mode

See `client/src/utils/api.ts` for implementation details.

## 📝 API Methods

All API methods are in `client/src/utils/api.ts`:

### User Profile
```typescript
api.updateProfile(profileData)  // Create or update user profile
api.getProfile(userId)          // Get user profile by Cognito ID
api.getUsers(filters)           // Get all users with optional filters
```

### Forum
```typescript
api.createForumPost(postData)           // Create new forum post
api.getForumPosts(category?, tags?)     // Get posts with filters
api.addForumComment(postId, content)    // Add comment to post
api.voteForumPost(postId, voteType)     // Upvote/downvote post
```

### Resources
```typescript
api.createResource(resourceData)        // Share new resource
api.getResources(filters)               // Get resources with filters
api.rateResource(resourceId, rating)    // Rate a resource
```

## 🐛 Troubleshooting

### "Failed to update profile"
- Check Supabase RLS policies are configured correctly
- Run `fix_users_rls.sql` in Supabase SQL Editor
- Verify `cognito_id` matches authenticated user

### Google Maps not loading
- Verify `REACT_APP_GOOGLE_MAPS_API_KEY` is set in `.env`
- Check API key has Maps JavaScript API enabled
- Ensure billing is enabled on Google Cloud project

### Authentication redirect fails
- Verify Cognito callback URLs include your domain
- Check both localhost:3000 and CloudFront URL are configured
- Ensure `amplifyconfiguration.json` has correct User Pool details

### Supabase connection errors
- Verify `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` are correct
- Check Supabase project is not paused (free tier auto-pauses after inactivity)
- Confirm RLS policies allow the operation you're attempting

## 📈 Roadmap

### Phase 1: Core Features ✅
- [x] Authentication with AWS Cognito
- [x] User profile creation and editing
- [x] Google Maps integration
- [x] Forum posts and comments
- [x] Resources sharing
- [x] CloudFront deployment

### Phase 2: Enhanced Networking
- [ ] Connection requests and management
- [ ] Direct messaging between users
- [ ] User search and filtering
- [ ] Profile recommendations

### Phase 3: Advanced Features
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Premium features
- [ ] Job board integration

### Phase 4: Production Polish
- [ ] Custom domain (mappm.com)
- [ ] Performance optimization
- [ ] Comprehensive testing
- [ ] Security audit
- [ ] Analytics dashboard

## 🤝 Contributing

This is currently a private MVP project. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For questions or issues, please create an issue in the GitHub repository.

---

**Last Updated**: September 30, 2025
**Status**: MVP Complete - All core features functional
**Live URL**: https://YOUR_CLOUDFRONT_DISTRIBUTION_ID.cloudfront.net/
