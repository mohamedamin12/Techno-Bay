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
   ```cd Techno-Bay



   ## إعدادات البيئة (Environment Variables)

```env
DB_HOST =
DB_PORT =
DB_NAME =
DB_USERNAME =
DB_PASSWORD =

jwtSecret =

CLOUDINARY_URL =
CLOUDINARY_CLOUD_NAME =
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET =

# NodeMailer - Email settings
# EMAIL_HOST=smtp.ethereal.email
# EMAIL_PORT=587
EMAIL_USER =
EMAIL_PASSWORD =

COOKIE_SECRET_KEY =

