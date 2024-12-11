import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserProfilePage.module.css';
import { fetchUserProfile, updateUserProfile } from '../../api/index';

const UserProfilePage = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    username: '',
    email: '',
    bio: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        const userProfile = await fetchUserProfile(userId);
        setUserData({
          fullName: userProfile.name || '',
          username: userProfile.username || '',
          email: userProfile.email || '',
          bio: userProfile.bio || 'Write something about yourself...',
        });
      } catch (error) {
        console.error('Failed to load user profile:', error);
        alert('Failed to load profile. Please try again.');
        navigate('/login');
      }
    };

    loadUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('No user found. Please login again.');
      navigate('/login');
      return;
    }

    const dataToSave = {
      name: userData.fullName,
      username: userData.username,
      email: userData.email,
      bio: userData.bio,
    };

    try {
      await updateUserProfile(userId, dataToSave);
      alert('Profile updated successfully!');
      navigate('/board');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };


  return (
    <div className={styles.profilePage}>
      <h1>Edit Profile</h1>
      <div className={styles.profileForm}>
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={userData.fullName}
          onChange={handleInputChange}
          placeholder="Enter your full name"
        />
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={userData.username}
          onChange={handleInputChange}
          placeholder="Enter your username"
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
        />
        <label>Bio</label>
        <textarea
          name="bio"
          value={userData.bio}
          onChange={handleInputChange}
          placeholder="Write something about yourself"
        ></textarea>
        <button onClick={saveProfile}>Save Profile</button>
      </div>
    </div>
  );
};

export default UserProfilePage;
