import React, { useState } from 'react';
import './addUser.css';
import axios from 'axios';
import { useUserStore } from '../../../../lib/userStore';

export const AddUser = ({ onAdd }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get('username');

    try {
      const response = await axios.get(`/api/users?username=${username}`);
      const fetchedUser = response.data;

      if (fetchedUser) {
        setUser(fetchedUser);
      } else {
        console.log("User not found.");
        setUser(null);
      }
    } catch (error) {
      console.error("Error searching user:", error);
    }
  };

  const handleAdd = async () => {
    if (!currentUser?.id || !user?.id) {
      console.log("Missing user or current user information.");
      return;
    }

    try {
      const chatId =
        currentUser.id > user.id
          ? `${currentUser.id}_${user.id}`
          : `${user.id}_${currentUser.id}`;

      await axios.post(`/api/chats`, {
        chatId,
        participants: [currentUser.id, user.id],
      });

      console.log("Chat created successfully.");
      onAdd(); // Close modal on successful addition
    } catch (error) {
      console.error("Error adding user to chat:", error);
    }
  };

  return (
    <div className="add-user-container">
      <h1 className="heading">Add User</h1>
      <form onSubmit={handleSubmit} className="form-section">
        <input
          type="text"
          placeholder="Enter username"
          className="username-input"
          name="username"
        />
        <button className="search-dialog">
          <img src="./search.png" alt="" />
        </button>
      </form>
      {user && (
        <div className="dialog-user">
          <div className="dialog-detail">
            <img src={user.avatar || './avatar.png'} alt="" />
            <h4>{user.fullName}</h4>
            <button className="add-btn">
              <img
                src="./plus.png"
                alt="Add"
                className="add-icon"
                onClick={handleAdd}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
