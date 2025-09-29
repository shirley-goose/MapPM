#!/bin/bash

# MapPM Deployment Script for AWS

echo "🚀 Deploying MapPM to AWS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."

    command -v npm >/dev/null 2>&1 || { print_error "npm is required but not installed. Aborting."; exit 1; }
    command -v aws >/dev/null 2>&1 || { print_error "AWS CLI is required but not installed. Please install it first."; exit 1; }

    print_success "All requirements met!"
}

# Install Amplify CLI if not present
install_amplify() {
    if ! command -v amplify &> /dev/null; then
        print_status "Installing AWS Amplify CLI..."
        npm install -g @aws-amplify/cli
        print_success "Amplify CLI installed!"
    else
        print_success "Amplify CLI already installed!"
    fi
}

# Deploy frontend
deploy_frontend() {
    print_status "Deploying frontend to AWS Amplify..."

    cd client

    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm ci

    # Build the project
    print_status "Building frontend..."
    npm run build

    # Check if Amplify is initialized
    if [ ! -d "amplify" ]; then
        print_warning "Amplify not initialized. Please run 'amplify init' first."
        print_status "You can also manually deploy via AWS Amplify Console:"
        print_status "1. Go to AWS Amplify Console"
        print_status "2. Connect your GitHub repository"
        print_status "3. Set build settings to use client/ folder"
        return 1
    fi

    # Deploy
    amplify publish

    cd ..
    print_success "Frontend deployed!"
}

# Deploy backend
deploy_backend() {
    print_status "Deploying backend to AWS Lambda..."

    cd server

    # Install dependencies
    print_status "Installing backend dependencies..."
    npm ci

    # Check if serverless is configured
    if ! command -v serverless &> /dev/null; then
        print_status "Installing Serverless Framework..."
        npm install -g serverless
    fi

    # Build and deploy
    print_status "Building and deploying backend..."
    npm run build

    # Check if serverless.yml exists
    if [ ! -f "serverless.yml" ]; then
        print_error "serverless.yml not found. Backend deployment skipped."
        print_status "You can deploy manually using:"
        print_status "1. AWS Lambda Console"
        print_status "2. AWS API Gateway"
        cd ..
        return 1
    fi

    serverless deploy

    cd ..
    print_success "Backend deployed!"
}

# Main deployment process
main() {
    print_status "Starting MapPM deployment process..."

    check_requirements
    install_amplify

    # Ask user what to deploy
    echo ""
    echo "What would you like to deploy?"
    echo "1) Frontend only (AWS Amplify)"
    echo "2) Backend only (AWS Lambda)"
    echo "3) Both frontend and backend"
    echo "4) Exit"

    read -p "Enter your choice (1-4): " choice

    case $choice in
        1)
            deploy_frontend
            ;;
        2)
            deploy_backend
            ;;
        3)
            deploy_frontend
            deploy_backend
            ;;
        4)
            print_status "Deployment cancelled."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac

    echo ""
    print_success "🎉 MapPM deployment completed!"
    print_status "Next steps:"
    echo "1. Configure your custom domain in AWS Amplify Console"
    echo "2. Update Auth0 settings with your production URLs"
    echo "3. Set up MongoDB Atlas for production"
    echo "4. Configure environment variables in AWS"
}

# Run main function
main