// src/components/Notifications.jsx
import React, { useState, useEffect } from 'react';
import './Notifications.css';

const Notifications = ({ notifications, clearNotification }) => {
  return (
    <div className="notifications-container">
      {notifications.map((notification, index) => (
        <div key={index} className="notification">
          <p>{notification.message}</p>
          <button onClick={() => clearNotification(index)}>X</button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
