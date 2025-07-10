import React, { useState } from "react";
import "./user.css";

export const User = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newFullName, setNewFullName] = useState(user.fullName || "Guest User");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const userData = { fullName: newFullName };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/update/${user.firebaseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
        },
        body: JSON.stringify(userData), // Send JSON
      });

      const data = await response.json();
      if (data.message === "User updated successfully") {
        console.log("User updated:", data.user);
        // Close the modal on successful save
        setIsEditing(false);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false); // Close the modal
    setNewFullName(user.fullName || "Guest User"); // Reset the name
  };

  return (
    <div className="user-info">
      <div className="user">
        <img src={user.photoURL} alt="User Avatar" />
        <span>{newFullName || "Guest User"}</span>
      </div>
      <div className="icons">
        <img src="./edit.png" alt="Edit" onClick={handleEditClick} />
      </div>

      {isEditing && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Edit Profile</h3>
            <label>
              Full Name:
              <input
                type="text"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
              />
            </label>

            <div className="edit-modal-actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
