# Portfolio Management Application

This portfolio management application allows users to effectively manage their portfolio items, including images and descriptions. The project features robust authentication, role-based access control for admin and editor roles, and CRUD operations for portfolio items. The frontend is designed with a clean, responsive layout using Bootstrap and EJS templates.

## Features
- **Authentication**: Role-based access for admin and editor roles.
- **CRUD Operations**: Create, Read, Update, and Delete portfolio items.
- **Responsive Design**: Built using Bootstrap for a seamless user experience across devices.
- **Image Uploading and Display**: Includes image carousel for easy viewing.
- **Two API Integrations**: Integrate external APIs for data visualization.
- **Two Datasets for Data Visualization**: Utilize two datasets for interactive visualizations.
- **Nodemailer Integration**: Send notifications and messages via email.
- **Two-Factor Authentication (2FA)**: Enhance security with 2FA setup using one-time passwords (OTP) and QR code scanning.

## Technologies Used
- **Node.js**: Backend runtime for the application.
- **Express**: Web framework for Node.js.
- **Express-Session**: Manage user sessions.
- **EJS**: Embedded JavaScript templates for rendering HTML.
- **MongoDB**: NoSQL database for user data and portfolio items.
- **bcrypt.js**: Password hashing for security.
- **Nodemailer**: Send email notifications.
- **Bootstrap**: Styling for a responsive frontend.
- **Axios**: For API integrations.
- **otplib**: Manage one-time passwords for 2FA.
- **qrcode**: Generate QR codes for 2FA setup.
- **csv-parser**: Parse CSV files for data import.
- **connect-flash**: Display temporary messages during redirection.
- **multer**: Handle file uploads to the server.

## Prerequisites
- **Node.js** (>= v18.x)
- **MongoDB** (for local development)
- **An Email Service Provider** (for sending emails via Nodemailer)

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/portfolio-management.git
   cd portfolio-management
2. **Install Dependencies:**:
    ``bash
    npm install

3. **Set Up Environment Variables:**:
Configure your Gmail app pass for Nodemailer.
Set up other necessary environment variables for API keys, database connection, etc.

4. **Run the project**: 
   ```bash
   npm start
   The application will be accessible at http://localhost:3000.

5. **Extra**: 
Third-Party APIs Used
Cars API: Provides data related to cars. (e.g., https://api.api-ninjas.com/v1/cars?make=Toyota)
Motorcycle API: Provides data related to motorcycles. (e.g., https://api.api-ninjas.com/v1/motorcycles?make=Kawasaki)

Two-Factor Authentication (2FA) Setup
Download and install an authenticator app, such as Google Authenticator, on your mobile device.
Scan the provided QR code using the app to link it with the website.
When prompted for OTP, open the app and enter the code displayed, which changes every 30 seconds.
Troubleshooting
If you encounter any issues during installation or usage, consider the following tips:

Ensure that MongoDB is running locally if you are using it for database storage.
Double-check environment variables for accuracy, especially the Gmail app pass for Nodemailer.
Ensure all dependencies are correctly installed by running npm install again.