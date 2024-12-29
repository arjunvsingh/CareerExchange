#!/bin/bash

# Create root project directory
mkdir -p job-bidding-platform
cd job-bidding-platform

# Initialize root package.json
npm init -y

# Create client directory and initialize with Vite
npm create vite@latest client -- --template react
cd client

# Create frontend directory structure
mkdir -p src/{components/{forms,jobs,ui},pages,services,hooks,context,utils,styles}
cd ..

# Create server directory and initialize
mkdir -p server/src/{controllers,models,routes,middleware,config,utils}
cd server
npm init -y

# Install essential server dependencies
npm install express pg dotenv cors

# Create database directory structure
cd ..
mkdir -p database/{migrations,seeds}

# Create essential files (empty)
touch client/src/components/forms/{JobPostingForm,BidForm}.jsx
touch client/src/components/jobs/{JobCard,JobList}.jsx
touch client/src/pages/{HomePage,PostJobPage,JobsPage}.jsx
touch client/src/services/api.js
touch client/src/App.jsx

touch server/src/controllers/{jobController,bidController}.js
touch server/src/models/{Job,Bid}.js
touch server/src/routes/{jobRoutes,bidRoutes}.js
touch server/src/middleware/errorHandler.js
touch server/src/config/{database,config}.js
touch server/src/app.js
touch server/.env

touch database/migrations/{001_create_jobs,002_create_bids}.sql
touch database/seeds/initial_data.sql

touch .gitignore README.md

# Create basic .gitignore
echo "node_modules/
.env
dist/
build/
.DS_Store" > .gitignore

# Create basic README
echo "# Job Bidding Platform

A platform where job seekers can bid on job postings.

## Setup Instructions

1. Install dependencies:
   \`\`\`bash
   cd client && npm install
   cd ../server && npm install
   \`\`\`

2. Set up environment variables:
   - Copy \`.env.example\` to \`.env\` in the server directory
   - Update with your database credentials

3. Start the development servers:
   - Client: \`cd client && npm run dev\`
   - Server: \`cd server && npm run dev\`
" > README.md

echo "Project structure created successfully!"