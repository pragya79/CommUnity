import './chatDetails.css';
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { toast } from 'react-toastify';

export const ChatDetails = ({ setHaveUser,selectedSender}) => {
  console.log("SelectedUser: ",selectedSender)
  const [theme, setTheme] = useState('light');
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const toggleAccountDetails = () => setShowAccountDetails((prev) => !prev);
  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("currentUser");
      setHaveUser(false);
      toast.success('Logout successful!');
    } catch (error) {
      toast.error(`Error logging out: ${error.message}`);
    }
  };

  return (
    <div className={`container ${theme}`}>
      <div className="user-info">
        <img 
          src={selectedSender?.avatar || './default-avatar.png'} 
          alt="User Avatar" 
          onClick={openDialog} 
        />
        <h2>{selectedSender?.fullName || 'Guest'}</h2>
        <p>{selectedSender?.description || 'Welcome to CommUnity. Here, you can connect and collaborate with others.'}</p>
      </div>

      <div className="info">
        {/* Theme Toggle */}
        <div className="option">
          <div className="title" onClick={toggleTheme}>
            <span>
              <strong>Mode:</strong> {theme === 'light' ? 'Light' : 'Dark'}
            </span>
            {theme === 'light' ? (
              <img src="./dark-mode.png" alt="Switch to Dark Mode" />
            ) : (
              <img src="./light-mode.png" alt="Switch to Light Mode" />
            )}
          </div>
        </div>

        {/* Account Details */}
        <div className="option">
          <div className="title" onClick={toggleAccountDetails}>
            <span><strong>Account Details</strong></span>
            <img src={showAccountDetails ? './arrowUp.png' : './arrowDown.png'} alt="Toggle Account Details" />
          </div>
          {showAccountDetails && (
            <div className="account-details">
              <p><strong>User Name:</strong> {selectedSender?.fullName || 'Guest'}</p>
              <p><strong>Description:</strong> {selectedSender?.description || 'Hey There! GLad to connect with you.'}</p>
            </div>
          )}
        </div>

        <div className="btn">
          <div className="title">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      {showDialog && (
        <div className="dialog-overlay" onClick={closeDialog}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>Profile</h2>
              <button className="close-button" onClick={closeDialog}><strong>X</strong></button>
            </div>
            <div className="dialog-content">
              <img src={selectedSender?.avatar || './default-avatar.png'} alt="User Avatar" />
              <h3>{selectedSender?.fullName || 'Guest'}</h3>
              <button onClick={closeDialog}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
