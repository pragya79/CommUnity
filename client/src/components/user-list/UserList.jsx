import React, { useEffect, useState } from "react";
import { User } from "./users/User";
import { Chat } from "./chats/Chat";
import "./userList.css";
import { UserChats } from "../user-chats/UserChats";

export const UserList = ({ currentUser, setSelectedSenderData }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentChat, setCurrentChat] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedSender, setSelectedSender] = useState(null);

  // Fetch users and set initial list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/getUsers?currentUserId=${currentUser.firebaseId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch users, status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data); // Initially show all users
      } catch (error) {
        console.error("Error fetching users:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.firebaseId) {
      fetchUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(user =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleAddUserToChat = async (userId, fullName, avatar) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chatConvo/${currentUser.firebaseId}/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add user to chat, status: ${response.status}`);
      }

      const conversation = await response.json();

      if (conversation && conversation._id) {
        setCurrentChat(conversation);
        setChatId(conversation._id);
        setSelectedSender({ fullName, avatar, senderId: userId,description: conversation.description  });
        setSelectedSenderData({ fullName, avatar, description: conversation.description });
        console.log("New Conversation:", conversation);
      } else {
        console.error("Invalid response data:", conversation);
      }
    } catch (error) {
      console.error("Error adding user to chat:", error.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSelectSender = async (fullName, avatar, senderId,description) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chatConvo/${currentUser.firebaseId}/${senderId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch conversation, status: ${response.status}`);
      }
      const conversation = await response.json();
  
      setSelectedSender({
        fullName,
        avatar,
        senderId,
        description
      });
      setSelectedSenderData({
        fullName,
        avatar,
        description
      });
  
      setCurrentChat(conversation);
      setChatId(conversation._id);
    } catch (error) {
      console.error("Error fetching conversation:", error.message);
    }
  };

  return (
    <div className="left-user-container">
      <div className="user-list">
        <User user={currentUser} />
        <div className="search-container">
          <input
            type="text"
            placeholder="Search User"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="user-list-search">
            {filteredUsers.length === 0 ? (
              <div className="no-user">No users found</div>
            ) : (
              filteredUsers.map(user => (
                <div key={user.firebaseId} className="user-item">
                  <div className="name-text">
                    <img src={user.avatar} alt={user.fullName} className="user-avatar" />
                    <span>{user.fullName}</span>
                  </div>
                  <button onClick={() => handleAddUserToChat(user.firebaseId, user.fullName, user.avatar)}>
                    <img src="./plus.png" alt="Add" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        <Chat onSelectSender={handleSelectSender} currentChatId={chatId} />
      </div>

      {selectedSender ? (
        <div className="user-chat-comp">
          <UserChats
            fullName={selectedSender.fullName}
            avatar={selectedSender.avatar}
            userId={currentUser.firebaseId}
            currentChatId={chatId}
            currentChat={currentChat}
            senderId={selectedSender.senderId}
            description={selectedSender.description}
          />
        </div>
      ) : (
        <div className="h2-tag">
          <h2>Please Select a Conversation.</h2>
        </div>
      )}
    </div>
  );
};
