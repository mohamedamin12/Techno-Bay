# Techno-Bay

## Project Overview
Techno-Bay is an e-commerce platform designed to facilitate online shopping. This Node.js Express API provides robust backend functionalities for the platform, including user authentication, product management, and payment integrations.

## Features
* User Authentication: Secure user login and registration using bcryptjs and jsonwebtoken.
* Product Management: CRUD operations for managing products.
* Payment Integration: Seamless payments using Stripe.
* File Uploads: Image and file uploads handled with Multer and Cloudinary.
* Enhanced Security: Middleware like Helmet, CORS, and rate limiting for secure APIs.
* Performance Optimization: Compression and efficient data handling.

## Technologies Used
* Node.js
* Express.js
* MongoDB (using Mongoose for object modeling)
* Stripe (for payments)
* Cloudinary (for image uploads)
* dotenv (for environment variable management)

## Installation
### Prerequisites
* Node.js installed on your system
* MongoDB instance running

## Steps
1. Clone the repository:
   `git clone https://github.com/mohamedamin12/Techno-Bay.git`
2. Navigate to the project folder:
   `cd Techno-Bay`
3. Install dependencies:
   `npm install`
 4. Create a `.env` file and configure the following variables:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```
5. Start the server:
   `npm run start:dev`
6. Access the API at `http://localhost:7000.`.

## API Documentation 
The API documentation is available at the following URL: https://documenter.getpostman.com/view/34351164/2sAY547JqM
