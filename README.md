# 💬 CommUnity

### A Real-Time 🔐 Encrypted Chat Application

**CommUnity** is a secure, scalable, and user-friendly chat application designed to enable seamless real-time communication. Built with modern technologies like **React**, **Node.js**, **Firebase**, and **MongoDB**, it offers encrypted messaging using **AES**, image sharing via **Cloudinary**, and a responsive UI that adapts to all screen sizes.

---

## 🚀 Features

- 🔒 **AES Message Encryption**: Every message is encrypted using **AES (Advanced Encryption Standard)** to ensure end-to-end privacy and security.
- 🔄 **Real-Time Messaging (via Polling)**: Instant message updates using efficient client-side polling in place of WebSockets.
- ✅ **Firebase Authentication**: Secure, reliable user login and registration using **Firebase Auth**.
- 🖼️ **Media Upload Support**: Easily upload and share images using **Cloudinary**.
- 🗃️ **MongoDB Database**: Scalable and flexible **NoSQL** database for storing users and chat messages.
- 📱 **Responsive UI**: Built with **React** and **Tailwind CSS** to work seamlessly across mobile, tablet, and desktop.

---

## 🧰 Tech Stack

### 🖥️ Frontend
- **React** – Component-based UI library for dynamic interfaces.
- **Tailwind CSS** – Utility-first CSS framework for styling.
- **Vite** – Fast frontend build tool and development server.

### ⚙️ Backend
- **Node.js** – JavaScript runtime for server-side logic.
- **Express.js** – Minimalist web framework for building REST APIs.

### 🗄️ Database
- **MongoDB** – Document-based NoSQL database for efficient data management.

### 🔐 Authentication
- **Firebase Auth** – Handles secure login, registration, and session management.

### 🌐 Media Handling
- **Cloudinary** – Cloud-based image and media upload, transformation, and CDN.

### 🔐 Encryption
- **AES (Advanced Encryption Standard)** – Symmetric encryption algorithm for securing chat messages before storage/transmission.

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


## 🤝 Contributing

We welcome contributions to improve CommUnity! Follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## 📞 Contact

If you have any questions or feedback, feel free to reach out:
- **Email**: pragyaxibs4834@gmail.com
- **LinkedIn**: [Pragya Sharma](https://www.linkedin.com/in/pragya-sharma-4a2136260/)

---

Thank you for checking out CommUnity!

