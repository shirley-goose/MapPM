# 🚀 MapPM AWS Deployment Guide

## Prerequisites

1. **AWS Account** - Sign up at [aws.amazon.com](https://aws.amazon.com)
2. **AWS CLI** installed and configured
3. **Domain** - Your personal domain ready to connect

## Option A: AWS Amplify (Recommended - Easier)

### Step 1: Deploy Frontend with AWS Amplify

1. **Install Amplify CLI:**
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Initialize Amplify:**
   ```bash
   amplify configure
   # Follow prompts to set up AWS credentials

   amplify init
   # Project name: mappm
   # Environment: prod
   # Default editor: Visual Studio Code
   # App type: javascript
   # Framework: react
   # Source directory: client/src
   # Distribution directory: client/build
   # Build command: npm run build
   # Start command: npm start
   ```

3. **Add Hosting:**
   ```bash
   amplify add hosting
   # Select: Amazon CloudFront and S3
   # Hosting bucket name: mappm-hosting
   ```

4. **Deploy:**
   ```bash
   amplify publish
   ```

   You'll get a URL like: `https://dev.d1234567890.amplifyapp.com`

### Step 2: Deploy Backend with AWS Lambda

1. **Install Serverless Framework:**
   ```bash
   npm install -g serverless
   ```

2. **Configure AWS credentials:**
   ```bash
   serverless config credentials --provider aws --key YOUR_KEY --secret YOUR_SECRET
   ```

3. **Deploy backend:**
   ```bash
   cd server
   npm run build
   serverless deploy
   ```

### Step 3: Connect Your Domain

1. **In AWS Amplify Console:**
   - Go to your MapPM app
   - Click "Domain management"
   - Add your domain: `mappm.yourdomain.com`
   - Follow DNS verification steps

2. **Update environment variables in Amplify:**
   ```
   REACT_APP_AUTH0_DOMAIN=your-auth0-domain.auth0.com
   REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
   REACT_APP_AUTH0_AUDIENCE=https://mappm-api
   REACT_APP_API_URL=https://your-api-gateway-url/api
   REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key
   ```

## Option B: Complete AWS Infrastructure (Advanced)

### Using AWS CDK for Full Infrastructure

1. **Install AWS CDK:**
   ```bash
   npm install -g aws-cdk
   ```

2. **Bootstrap CDK:**
   ```bash
   cdk bootstrap
   ```

3. **Deploy full stack:**
   ```bash
   # Will be implemented if you choose this option
   ```

## Cost Estimation (Monthly)

### AWS Amplify Deployment:
- **Amplify Hosting**: $1-5 (depending on traffic)
- **Lambda Functions**: $5-15 (depending on usage)
- **API Gateway**: $3-10 (per million requests)
- **CloudFront CDN**: $1-5 (depending on traffic)
- **Total**: ~$10-35/month

### Additional Services:
- **MongoDB Atlas**: $9-25/month
- **Domain**: $10-15/year
- **SSL Certificate**: Free (via AWS Certificate Manager)

## Security & Performance Features

✅ **Automatic HTTPS** via AWS Certificate Manager
✅ **Global CDN** via CloudFront
✅ **Auto-scaling** via Lambda
✅ **DDoS Protection** via AWS Shield
✅ **High Availability** across multiple AWS regions
✅ **Monitoring** via CloudWatch

## Next Steps

1. **Choose Option A** (recommended for MVP)
2. **Set up Auth0** with your production domain
3. **Configure MongoDB Atlas** for production
4. **Update DNS** to point to your AWS resources
5. **Test production deployment**

Would you like me to help you with any specific step?