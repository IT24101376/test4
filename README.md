# test4

# Food Delivery App - Setup Guide

## Backend Setup

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize npm and install dependencies
npm init -y
npm install express mongoose cors dotenv
npm install nodemon --save-dev

# Create environment file
touch .env  # or create manually

# Add the following to package.json scripts:
# "start": "node index.js",
# "dev": "nodemon index.js"

# Run development server
npm run dev

# Create frontend directory
mkdir frontend
cd frontend

# Create Vite React app
npm create vite@latest
# Select: React
# Select: JavaScript

# Navigate to project and install dependencies
cd vite-project
npm install

# Run development server
npm run dev


# Clone repository (if exists)
git clone <repository-url>
cd .\food\
code .

# Git workflow
git add .
git commit -m "Initial commit"
git push


#Deployment Configuration
Vercel Deployment (Frontend)
Root Directory: frontend/vite-project

Build Command: npm run build

Output Directory: dist

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


# Install dependencies(Render)
npm install  # or yarn install

# Start server
npm start    # or yarn start

VITE_APP_URL=http://localhost:5173/api(frontend)