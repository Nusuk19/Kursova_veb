import React, { useState } from 'react';
import { registerUser } from '../../api/index';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Data being sent:", { email, password, username, name });
    try {
      await registerUser({ email, password, username, name });
      alert("Registration Successful!");
      navigate("/login");
    } catch (error) {
      alert("Registration failed: " + error.response?.data?.error || error.message);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formContainer}>
        <h1 className={styles.term}>Register</h1>
        <form onSubmit={handleRegister}>
          <input
            className={styles.inputField}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={styles.inputField}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className={styles.inputField}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className={styles.inputField}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button className={styles.submitButton} type="submit">Register</button>
        </form>
        <p className={styles.registrationNote}>
          Already have an account? <a className={styles.loginLink} href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
