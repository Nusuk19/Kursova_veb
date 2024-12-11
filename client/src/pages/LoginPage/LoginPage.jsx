import React, { useState } from 'react';
import { loginUser } from '../../api/index';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem("userId", response.user.uid); // Збереження userId
      alert("Login Successful!");
      navigate("/board");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleLogin}>
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
          <button className={styles.submitButton} type="submit">Login</button>
        </form>
        <p className={styles.helperText}>
          Don't have an account? <a className={styles.helperLink} href="/register">Register</a>
        </p>
        <p className={styles.helperText}>
          <a className={styles.helperLink} href="/reset-password">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
