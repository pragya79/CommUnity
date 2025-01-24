import React, { useState, useEffect } from "react";
import { auth, onAuthStateChanged, db, doc, onSnapshot } from "./lib/firebase";
import { ChatDetails } from "./components/chat-details/ChatDetails";
import { UserList } from "./components/user-list/UserList";
import { Login } from "./components/login-page/Login";
import { Notify } from "./components/notification/Notify";

const App = () => {
  const [haveUser, setHaveUser] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSenderData, setSelectedSenderData] = useState({ fullName: "", avatar: "", description:"" }); // State to store selected sender's data

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      setHaveUser(true);
      setLoading(false); // Set loading to false if user is found
      return;
    }
  
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.data();
            const updatedUser = {
              firebaseId: user.uid,
              name: userData.fullName || user.displayName || "Guest",
              avatar: userData.avatar || user.photoURL || "./default-avatar.png",
            };
  
            setCurrentUser(updatedUser);
            localStorage.setItem("currentUser", JSON.stringify(updatedUser)); // Save current user info with firebaseId to localStorage
            setHaveUser(true);
          } else {
            setHaveUser(false);
            setCurrentUser(null);
            localStorage.removeItem("currentUser");
          }
          setLoading(false); // End loading after Firestore operation
        });
  
        return () => unsubscribeUser();
      } else {
        setHaveUser(false);
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
        setLoading(false); 
      }
    });
  
    return () => unsubscribeAuth();
  }, []);
  

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.error("App initialization timed out.");
        setLoading(false);
      }
    }, 10000);
    return () => clearTimeout(timeout);
  }, [loading]);

  if (loading) {
    return <div className="loading-screen">Initializing app...</div>;
  }

  return (
    <div className="app-container">
      {haveUser ? (
        <>
          <UserList currentUser={currentUser} setSelectedSenderData={setSelectedSenderData} />
          <ChatDetails
            setHaveUser={setHaveUser}
            selectedSender={selectedSenderData} 
          />
        </>
      ) : (
        <Login setHaveUser={setHaveUser} setCurrentUser={setCurrentUser} />
      )}
      <Notify />
    </div>
  );
};

export default App;
