# CommUnity

### A Real-Time Chat Application

CommUnity is a robust and user-friendly chat application designed to foster seamless communication. Built with modern web technologies, it offers a real-time messaging experience, secure authentication, and efficient media handling.

---

## Features

- **Real-Time Messaging**: Instant communication between users.
- **Secure Authentication**: User authentication powered by Firebase.
- **Media Uploads**: Efficient image handling with Cloudinary.
- **Scalable Database**: MongoDB for storing user and message data.
- **Responsive Design**: Works seamlessly on all device sizes.

---

## Tech Stack

### Frontend
- **React**: For building a dynamic and interactive user interface.

### Backend
- **Node.js**: For managing the server-side logic and APIs.

### Database
- **MongoDB**: A NoSQL database for efficient data storage and retrieval.

### Authentication
- **Firebase**: Provides secure and reliable user authentication.

### Media Handling
- **Cloudinary**: Handles image uploads and optimizations.

---

## Installation & Setup

Follow these steps to get the application up and running on your local machine:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/pragya79/CommUnity.git
   cd community
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd client
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Run the Application**
   - Start the backend server:
     ```bash
     npm start
     ```
   - Start the React frontend:
     ```bash
     cd client
     npm run dev
     ```

5. **Access the Application**
   Open your browser and navigate to: `http://localhost:5173`

---


## Contributing

We welcome contributions to improve CommUnity! Follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## Contact

If you have any questions or feedback, feel free to reach out:
- **Email**: pragyaxibs4834@gmail.com
- **LinkedIn**: [Pragya Sharma](https://www.linkedin.com/in/pragya-sharma-4a2136260/)

---

Thank you for checking out CommUnity!

