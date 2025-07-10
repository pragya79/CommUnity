import './userChats.css';
import React, { useEffect, useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import { format } from 'timeago.js';


export const UserChats = ({ fullName, avatar, userId, currentChatId ,currentChat,senderId,description}) => {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(localStorage.getItem('backgroundImage') || '');
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const endRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversations,setConversations]=useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [messageStats, setMessageStats] = useState({ sentByUser: 0, sentBySender: 0 });
  const [openImage, setOpenImage] = useState(null); 
  
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/chatConvo/" + userId);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [userId]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`${process.env.VITE_BACKEND_URL}/api/msg/${currentChatId}`);
        console.log("RES", res.data);
        setMessages(res.data);
        const sentByUser = res.data.filter((msg) => msg.sender === senderId).length;
        const sentBySender = res.data.filter((msg) => msg.sender !== senderId).length;
        
        setMessageStats({ sentByUser, sentBySender });
        
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat, currentChatId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage && !image) return;
  
    const message = {
      chatConvoId: currentChatId,
      sender: senderId,
      text: newMessage || "",
      image, 
      isSent: false,
    };
  
    console.log("Sending message:", message); 
  
    try {
      const res = await axios.post(`${process.env.VITE_BACKEND_URL}/api/msg`, message);
      console.log("Message sent successfully:", res.data);
      setMessages([...messages, res.data]);
      setNewMessage("");
      setImage(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  
  
  
  const toggleBold = () => setIsBold((prev) => !prev);
  const toggleItalic = () => setIsItalic((prev) => !prev);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const response = await axios.post(`${process.env.VITE_BACKEND_URL}/api/cloudinary/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Uploaded Image URL:', response.data.imageUrl);
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error; 
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageBase64 = event.target.result;
        try {
          const uploadedImageUrl = await uploadImage(file); 
          console.log('Image uploaded successfully:', uploadedImageUrl);
          setImage(uploadedImageUrl); 
        } catch (error) {
          console.error('Failed to upload image:', error);
        }
      };
      reader.readAsDataURL(file); 
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const savedBackgroundImage = localStorage.getItem("backgroundImage");
    if (savedBackgroundImage) {
      setBackgroundImage(savedBackgroundImage);
    }
  }, []);

  const handleBGChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const newBackground = event.target.result;
        setBackgroundImage(newBackground);
        localStorage.setItem("backgroundImage", newBackground);
      };
      reader.readAsDataURL(file);
    }
  };
  const openWebcam = () => {
    setIsWebcamOpen(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => console.error('Webcam access denied:', err));
  };
  

  const stopWebcamStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png'); // Capture the photo
    
    uploadImage(imageData) // Upload the captured photo to the server
      .then((uploadedImageUrl) => {
        setImage(uploadedImageUrl); 
        stopWebcamStream(); 
        setIsWebcamOpen(false);
      })
      .catch((error) => {
        console.error('Failed to upload webcam image:', error);
      });
  };
  
  const closeWebcam = () => {
    stopWebcamStream();
    setIsWebcamOpen(false);
  };

  const handleEmoji = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji); 
    setNewMessage((prev) => prev + emojiData.emoji);
    setOpen(false);
  };
  const handleInfoClick = () => {
    setIsInfoModalOpen(true);
  };
  const handleCloseInfoModal = () => {
    setIsInfoModalOpen(false);
  };
  
  const formatTimestamp = (timestamp) => format(timestamp);

  const handleImageClick = (image) => {
    setOpenImage(image); 
  };
  const closeDialog = () => {
    setOpenImage(null); 
  };



  return (
    <div className="user-chats">
      <div className="top-container">
        <div className="top-info">
          <img src={avatar || './avatar.png'} alt="" />
          <div className="top-content">
            <h3>{fullName}</h3>
            <p>{description}</p>
          </div>
        </div>
        <div className="icons">
          <img src="./info.png" alt="" onClick={handleInfoClick}/>
          <img
            src="./change-bg.jpg"
            alt="Change Background"
            onClick={() => document.getElementById('fileInput').click()}
            style={{ cursor: 'pointer' }}
          />
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleBGChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div
        className="middle-container"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.sender === senderId ? "own" : "received"}`}
          style={msg.image ? { background: "transparent" } : {}}
        >
          {msg.image && (
            <img
              src={msg.image}
              alt="Sent"
              style={{
                width: "250px",
                height: "100px",
                maxHeight: "100%",
                objectFit: "cover",
                borderRadius: "16px",
                margin: "auto",
                cursor: "pointer", 
              }}
              onClick={() => handleImageClick(msg.image)}
            />
          )}
          <div className="message-container">
            {msg.text && <p dangerouslySetInnerHTML={{ __html: msg.text }} />}
          </div>
          <div className="message-bottom">{formatTimestamp(msg.createdAt)}</div>
        </div>
      ))}
        <div ref={endRef}></div>

        {openImage && (
        <div
          className="dialog"
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
          }}
          onClick={closeDialog} // Close dialog when clicking outside the image
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "8px",
              border: 'none'
            }}
          >
            <img
              src={openImage}
              alt="Dialog View"
              style={{
                width: "500px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                border: 'none'
              }}
            />
            <button
              onClick={closeDialog}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </div>
        </div>
      )}
      </div>


      <div className="bottom-container">
        <div className="icons">
          <img
            src="./img.png"
            alt="Upload"
            onClick={() => fileInputRef.current.click()}
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
          />
          
          <img src="./camera.png" alt="Webcam" onClick={openWebcam} />
        </div>

        <input
          type="text"
          value={newMessage}
          placeholder="Type a message..."
          onChange={(e) => { setInput(e.target.value), setNewMessage(e.target.value) }}
          style={{
            fontWeight: isBold ? 'bold' : 'normal',
            fontStyle: isItalic ? 'italic' : 'normal',
          }}
        />
        <div className="text-options">
          <button className="format-button" onClick={toggleBold}>
            <img src="./bold.png" alt="Bold" />
          </button>
          <button className="format-button" onClick={toggleItalic}>
            <img src="./italic.png" alt="Italic" />
          </button>
        </div>

        <div className="emojis">
          <img src="./emoji.png" alt="Emoji" onClick={() => setOpen((prev) => !prev)} />
          {open && (
            <div className="emoji-picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>

        <button className="send" onClick={handleSubmit}>
          <img src="./send.png" alt="Send" />
        </button>
      </div>

      {isWebcamOpen && (
        <div className="webcam-modal">
          <video ref={videoRef} autoPlay></video>
          <div className="btn-container">
            <button onClick={capturePhoto}>Capture</button>
            <button onClick={closeWebcam}>Close</button>
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} width="400" height="300"></canvas>
        </div>
      )}
      {isInfoModalOpen && (
        <div className="info-modal">
          <div className="modal-content">
          <h4>Message Stats</h4>
          <p><strong>Messages sent by You:</strong> {messageStats.sentByUser}</p>
          <p><strong>Messages sent by {fullName}:</strong> {messageStats.sentBySender}</p>
            <button onClick={handleCloseInfoModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};  