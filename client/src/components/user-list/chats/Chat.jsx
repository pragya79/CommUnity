import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './chat.css';

export const Chat = ({ onSelectSender, currentChatId }) => {
  const [user, setUser] = useState(null); // Logged-in user info
  const [convo, setConvo] = useState([]); // Conversations
  const [userInfo, setUserInfo] = useState({}); // Cache for user information
  const [lastMsg, setLastMsg] = useState({}); // Last message for the current chat

  const fetchUserInfo = async (userId) => {
    if (!userId || userInfo[userId]) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/getUser/${userId}`);
      setUserInfo((prev) => ({
        ...prev,
        [userId]: res.data,
      }));
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          console.warn("No user data found in localStorage.");
        }
      } catch (error) {
        console.error("Error fetching user from localStorage: ", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user || !user.firebaseId) return;

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chatConvo/${user.firebaseId}`);
        if (Array.isArray(res.data)) {
          setConvo(res.data);
        } else {
          console.error("Expected array but got:", res.data);
          setConvo([]);
        }
      } catch (error) {
        console.error("Error fetching conversations: ", error);
      }
    };

    fetchConversations();
  }, [user]);

  useEffect(() => {
    convo.forEach((conversation) => {
      conversation.members.forEach((member) => fetchUserInfo(member));
    });
  }, [convo]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (currentChatId) {
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/msg/${currentChatId}`);
          const lastMessage = res.data[res.data.length - 1];
          if (lastMessage.chatConvoId === currentChatId) {
            setLastMsg(lastMessage);
          }
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    getMessages();
  }, [currentChatId]);

  return (
    <div className="chat-list">
      <ul>
        {convo.length > 0 ? (
          convo.map((conversation) => {
            const otherMemberId = conversation.members.find(
              (member) => member !== user?.firebaseId
            ); 
            const otherMember = userInfo[otherMemberId]; 

            return (
              <li
                key={conversation._id}
                className="chat-item"
                onClick={() =>
                  otherMember &&
                  onSelectSender(
                    otherMember.fullName,
                    otherMember.avatar,
                    otherMember.firebaseId,
                    otherMember.description
                  )
                }
              >
                {otherMember && <div className="chat-text">
                    <img
                      src={otherMember.avatar || "./avatar.png"}
                      alt={otherMember.fullName}
                      className="avatar"
                    />
                    <div className="sender-msg">
                      <h3>{otherMember.fullName}</h3>
                      {lastMsg.chatConvoId === conversation._id && (
                        <div className="time-msg">
                          <p>{lastMsg?.text || (lastMsg?.image && "Photo")}</p>
                          <small>
                            {lastMsg?.createdAt
                              ? new Date(lastMsg.createdAt).toLocaleString()
                              : ""}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>}
              </li>
            );
          })
        ) : (
          <p>Start a conversation</p>
        )}
      </ul>
    </div>
  );
};
