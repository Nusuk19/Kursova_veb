import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserProfile.module.css';
import { fetchUserProfile } from '../../api/index';

const UserProfile = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    fullName: '',
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
          username: userProfile.username || 'Guest',
          fullName: userProfile.name || 'Unknown User',
        });
      } catch (error) {
        console.error('Failed to load user profile:', error);
        alert('Failed to load profile. Please try again.');
        navigate('/login');
      }
    };

    loadUserProfile();
  }, [navigate]);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className={styles.profileWrapper}>
      <button
        className={styles.profileButton}
        onClick={toggleDropdown}
        aria-label="User menu"
      >
        <div className={styles.iconWrapper}>
          <span className={styles.iconLetter}>
            {userData.username.charAt(0).toUpperCase()}
          </span>
        </div>
      </button>
      {dropdownVisible && (
        <ul className={styles.dropdownMenu}>
          <li onClick={() => navigate('/profile')}>View Profile</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      )}
      <span className={styles.fullName}>{userData.fullName}</span>
    </div>
  );
};

export default UserProfile;
