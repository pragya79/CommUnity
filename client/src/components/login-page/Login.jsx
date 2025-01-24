import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "../../lib/firebase";
import './login.css';

export const Login = ({ setHaveUser, setCurrentUser }) => {
  const [avatar, setAvatar] = useState({ file: null, url: "" });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description,setDescription]=useState("")

  const handleAvatar = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const avatarUrl = await uploadAvatarToCloudinary(file);
        setAvatar({ file: file, url: avatarUrl });
      } catch (error) {
        console.error("Error while setting avatar:", error);
      }
    }
  };

  const uploadAvatarToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat-app");
    formData.append("api_key", import.meta.env.CLOUDINARY_API_KEY);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/du7j4qpni/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error("Error uploading avatar to Cloudinary:", error);
      toast.error("Failed to upload avatar.");
      throw error;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setHaveUser(true);
      setCurrentUser(parsedUser);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const user = userCredential.user;
  
      const response = await fetch(`http://localhost:5000/api/users/getUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseId: user.uid }),
      });
  
      if (!response.ok) throw new Error("Failed to fetch user data.");
      const userData = await response.json();
  
      if (userData) {
        setHaveUser(true);
        setCurrentUser({
          ...user,
          fullName: userData.fullName,
          photoURL: userData.avatar,
          firebaseId: user.uid, // Store firebaseId here
        });
  
        // Save only the current user's info in localStorage
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            fullName: userData.fullName,
            photoURL: userData.avatar,
            firebaseId: user.uid, // Store firebaseId
          })
        );
  
        toast.success("Login successful!");
      } else {
        toast.error("User data not found.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!fullName || !registerEmail || !registerPassword) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }
  
    try {
      let avatarUrl = "";
      if (avatar.file) {
        avatarUrl = await uploadAvatarToCloudinary(avatar.file);
      }
  
      console.log("Data being sent to backend:", {
        firebaseId: auth.currentUser?.uid, // Use the Firebase user ID directly here
        email: registerEmail,
        fullName,
        avatar: avatarUrl,
        description : description
      });
  
      const res = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = res.user;
  
      const response = await fetch("http://localhost:5000/api/users/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseId: user.uid,
          email: registerEmail,
          fullName,
          avatar: avatarUrl,
          description: description || "Hey there!"
        }),
      });
  
      if (!response.ok) {
        throw new Error("Error while saving user data.");
      }
  
      const userData = await response.json();
  
      // Check if the user was added successfully
      if (userData) {
        toast.success("Registration successful! Please log in now.");
        setRegisterEmail("");
        setRegisterPassword("");
        setFullName("");
        setDescription("");
        setIsRegistering(false);
        setHaveUser(false);
      } else {
        toast.error("Failed to register user.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="login-page">
      <div className="login-container">
        {isRegistering ? (
          <div className="register">
            <h2>Register</h2>
            <form className="form" onSubmit={handleRegister}>
              <div className="login-avatar-container">
                <label htmlFor="file">
                  <img
                    src={avatar.url || "./avatar.png"}
                    alt="avatar"
                    className="login-avatar"
                  />
                </label>
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  onChange={handleAvatar}
                />
              </div>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <label htmlFor="email-register">Email</label>
              <input
                type="email"
                id="email-register"
                placeholder="Enter your email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
              <label htmlFor="password-register">Password</label>
              <input
                type="password"
                id="password-register"
                placeholder="Create a password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
               <label htmlFor="password-register">Description</label>
              <input
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button type="submit" className="btns" disabled={loading}>
                Register
              </button>
              <p>
                Already have an account?{" "}
                <strong onClick={() => setIsRegistering(false)}>
                  <span className="reg">Login</span>
                </strong>
              </p>
            </form>
          </div>
        ) : (
          <div className="login">
            <h2>Login</h2>
            <form className="form" onSubmit={handleLogin}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <button type="submit" className="btns" disabled={loading}>
                Login
              </button>
              <p>
                Don't have an account?{" "}
                <strong onClick={() => setIsRegistering(true)}>
                  <span className="reg">Register</span>
                </strong>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
