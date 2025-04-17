
# Azure Integration Guide

This document provides detailed instructions for integrating this portfolio application with Azure services, specifically focusing on database connectivity using either Docker containers or Virtual Machines for deployment.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Azure SQL Database Setup](#azure-sql-database-setup)
4. [Deployment Options](#deployment-options)
   - [Option 1: Docker Deployment](#option-1-docker-deployment)
   - [Option 2: Azure Virtual Machine Deployment](#option-2-azure-virtual-machine-deployment)
5. [Connecting the Application to Azure Database](#connecting-the-application-to-azure-database)
6. [Security Best Practices](#security-best-practices)
7. [Testing the Integration](#testing-the-integration)
8. [Troubleshooting](#troubleshooting)

## Project Overview

This portfolio website is built using React, TypeScript, and Tailwind CSS. The current implementation is an MVP (Minimum Viable Product) with a focus on frontend components. The next phase involves integrating with Azure services, specifically setting up and connecting to an Azure SQL Database.

## Prerequisites

Before you begin the integration process, ensure you have:

- An Azure account with active subscription
- Basic knowledge of SQL and database concepts
- Node.js and npm installed locally
- Docker installed (if using Docker deployment)
- Azure CLI installed
- Git for version control

## Azure SQL Database Setup

1. **Create an Azure SQL Database:**

   ```bash
   # Login to Azure
   az login

   # Create a resource group
   az group create --name portfolio-rg --location eastus

   # Create an Azure SQL Server
   az sql server create \
     --name portfolio-sql-server \
     --resource-group portfolio-rg \
     --location eastus \
     --admin-user dbadmin \
     --admin-password <secure-password>

   # Create a database
   az sql db create \
     --resource-group portfolio-rg \
     --server portfolio-sql-server \
     --name portfolio-db \
     --service-objective Basic
   ```

2. **Configure Firewall Rules:**

   ```bash
   # Allow Azure services
   az sql server firewall-rule create \
     --resource-group portfolio-rg \
     --server portfolio-sql-server \
     --name AllowAzureServices \
     --start-ip-address 0.0.0.0 \
     --end-ip-address 0.0.0.0

   # Allow your client IP (replace with your IP)
   az sql server firewall-rule create \
     --resource-group portfolio-rg \
     --server portfolio-sql-server \
     --name AllowClientIP \
     --start-ip-address <your-ip-address> \
     --end-ip-address <your-ip-address>
   ```

3. **Set up a database schema:**

   Connect to your database using SQL Server Management Studio, Azure Data Studio, or the Azure Portal Query Editor and execute the following SQL to create tables:

   ```sql
   -- Create Projects table
   CREATE TABLE Projects (
       id INT PRIMARY KEY IDENTITY(1,1),
       title NVARCHAR(100) NOT NULL,
       description NVARCHAR(MAX),
       imageUrl NVARCHAR(255),
       projectUrl NVARCHAR(255),
       createdAt DATETIME DEFAULT GETDATE()
   );

   -- Create Contacts table
   CREATE TABLE Contacts (
       id INT PRIMARY KEY IDENTITY(1,1),
       name NVARCHAR(100) NOT NULL,
       email NVARCHAR(100) NOT NULL,
       message NVARCHAR(MAX),
       createdAt DATETIME DEFAULT GETDATE()
   );

   -- Insert sample data
   INSERT INTO Projects (title, description, imageUrl, projectUrl)
   VALUES 
       ('Azure Database Integration', 'A project showcasing secure connection to Azure SQL Database with proper authentication and data handling.', '', ''),
       ('Docker Containerization', 'Containerized web application with Docker for consistent deployment across various environments.', '', ''),
       ('Cloud-Native Application', 'Built a scalable application leveraging multiple Azure services with modern architecture principles.', '', '');
   ```

## Deployment Options

### Option 1: Docker Deployment

1. **Create a Dockerfile in the project root:**

   ```dockerfile
   # Base image
   FROM node:18-alpine as build

   # Set working directory
   WORKDIR /app

   # Copy package files
   COPY package*.json ./

   # Install dependencies
   RUN npm ci

   # Copy all files
   COPY . .

   # Build the application
   RUN npm run build

   # Production stage
   FROM nginx:stable-alpine

   # Copy build files to nginx
   COPY --from=build /app/dist /usr/share/nginx/html

   # Copy nginx configuration
   COPY nginx.conf /etc/nginx/conf.d/default.conf

   # Expose port
   EXPOSE 80

   # Start nginx
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create an nginx.conf file:**

   ```nginx
   server {
     listen 80;
     
     location / {
       root /usr/share/nginx/html;
       index index.html index.htm;
       try_files $uri $uri/ /index.html =404;
     }
   }
   ```

3. **Build and deploy to Azure Container Registry:**

   ```bash
   # Create Azure Container Registry
   az acr create --resource-group portfolio-rg --name portfolioacr --sku Basic

   # Log in to ACR
   az acr login --name portfolioacr

   # Build and push container
   docker build -t portfolioacr.azurecr.io/portfolio:latest .
   docker push portfolioacr.azurecr.io/portfolio:latest

   # Create App Service plan
   az appservice plan create --name portfolio-plan --resource-group portfolio-rg --sku B1 --is-linux

   # Create Web App
   az webapp create --resource-group portfolio-rg --plan portfolio-plan --name portfolio-app --deployment-container-image-name portfolioacr.azurecr.io/portfolio:latest

   # Configure container settings
   az webapp config container set --name portfolio-app --resource-group portfolio-rg --docker-custom-image-name portfolioacr.azurecr.io/portfolio:latest --docker-registry-server-url https://portfolioacr.azurecr.io
   ```

### Option 2: Azure Virtual Machine Deployment

1. **Create a Virtual Machine:**

   ```bash
   # Create a VM
   az vm create \
     --resource-group portfolio-rg \
     --name portfolio-vm \
     --image UbuntuLTS \
     --admin-username azureuser \
     --generate-ssh-keys \
     --public-ip-sku Standard

   # Open ports
   az vm open-port --resource-group portfolio-rg --name portfolio-vm --port 80,443
   ```

2. **SSH into the VM and set up the environment:**

   ```bash
   # SSH into VM
   ssh azureuser@<vm-ip-address>

   # Update packages
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install Nginx
   sudo apt install nginx -y

   # Configure firewall
   sudo ufw allow 'Nginx Full'
   sudo ufw allow ssh
   sudo ufw enable

   # Clone your repository
   git clone <your-git-repo-url> portfolio
   cd portfolio

   # Install dependencies and build
   npm install
   npm run build

   # Configure Nginx
   sudo nano /etc/nginx/sites-available/portfolio
   ```

3. **Create Nginx configuration:**

   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       root /home/azureuser/portfolio/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Enable the site and restart Nginx:**

   ```bash
   sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Connecting the Application to Azure Database

1. **Create a Backend API:**

   For a full-stack application, you'll need a backend API to securely connect to the database. Add a new `api` folder to your project and create a simple Express server:

   ```bash
   # Install required packages
   npm install express cors mssql dotenv
   ```

2. **Create a server.js file:**

   ```javascript
   // api/server.js
   const express = require('express');
   const cors = require('cors');
   const sql = require('mssql');
   require('dotenv').config();

   const app = express();
   app.use(cors());
   app.use(express.json());

   // Database configuration
   const dbConfig = {
     server: process.env.DB_SERVER,
     database: process.env.DB_NAME,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     options: {
       encrypt: true,
       enableArithAbort: true
     }
   };

   // Projects endpoint
   app.get('/api/projects', async (req, res) => {
     try {
       await sql.connect(dbConfig);
       const result = await sql.query`SELECT * FROM Projects`;
       res.json(result.recordset);
     } catch (err) {
       console.error(err);
       res.status(500).send('Server error');
     } finally {
       sql.close();
     }
   });

   // Contact form endpoint
   app.post('/api/contact', async (req, res) => {
     try {
       const { name, email, message } = req.body;
       await sql.connect(dbConfig);
       await sql.query`INSERT INTO Contacts (name, email, message) VALUES (${name}, ${email}, ${message})`;
       res.status(201).send('Message received');
     } catch (err) {
       console.error(err);
       res.status(500).send('Server error');
     } finally {
       sql.close();
     }
   });

   const PORT = process.env.PORT || 3001;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

3. **Create a .env file (not to be committed to repository):**

   ```
   DB_SERVER=portfolio-sql-server.database.windows.net
   DB_NAME=portfolio-db
   DB_USER=dbadmin
   DB_PASSWORD=<your-secure-password>
   ```

4. **Update frontend to connect to API:**

   Modify the Projects and Contact components to fetch data from the API:

   ```typescript
   // In Projects.tsx
   import { useEffect, useState } from "react";

   interface Project {
     id: number;
     title: string;
     description: string;
     imageUrl: string;
     projectUrl: string;
   }

   const Projects = () => {
     const [projects, setProjects] = useState<Project[]>([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       fetch('http://localhost:3001/api/projects')
         .then(response => response.json())
         .then(data => {
           setProjects(data);
           setLoading(false);
         })
         .catch(error => {
           console.error('Error fetching projects:', error);
           setLoading(false);
         });
     }, []);

     if (loading) {
       return <div>Loading projects...</div>;
     }

     // Continue with rendering projects
     // ...
   };
   ```

   ```typescript
   // In Contact.tsx
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     try {
       const response = await fetch('http://localhost:3001/api/contact', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(formData),
       });
       
       if (response.ok) {
         alert('Message sent successfully!');
         setFormData({ name: '', email: '', message: '' });
       } else {
         alert('Failed to send message.');
       }
     } catch (error) {
       console.error('Error sending message:', error);
       alert('An error occurred. Please try again later.');
     }
   };
   ```

## Security Best Practices

1. **Secure Database Connection:**
   - Store connection strings in Azure Key Vault
   - Use managed identities where possible
   - Implement least privilege access

2. **API Security:**
   - Implement rate limiting
   - Use HTTPS for all communications
   - Validate and sanitize inputs
   - Implement proper error handling without exposing sensitive details

3. **Authentication:**
   - Consider adding Azure AD authentication for admin access
   - Implement JWT for API authentication if needed

## Testing the Integration

1. **Test Database Connection:**
   ```bash
   # Run the API locally
   node api/server.js
   
   # In another terminal, test the API
   curl http://localhost:3001/api/projects
   ```

2. **Test Contact Form Submission:**
   Use tools like Postman to test the contact form API endpoint:
   ```json
   POST http://localhost:3001/api/contact
   Content-Type: application/json

   {
     "name": "Test User",
     "email": "test@example.com",
     "message": "This is a test message"
   }
   ```

## Troubleshooting

- **Connection Issues:** Verify firewall rules are correctly configured
- **Authentication Errors:** Double-check username and password in environment variables
- **CORS Errors:** Ensure CORS is properly configured on the API
- **Deployment Failures:** Check logs in the Azure portal for detailed error messages

---

This integration guide provides a foundation for connecting your portfolio website to Azure SQL Database. As you develop your application further, you can enhance these integrations with additional Azure services like Azure Functions, Blob Storage, or Azure CDN for a more robust and scalable application.
