import React, { useState } from 'react';
import { resetPassword } from '../../api/index';
import { useNavigate } from 'react-router-dom';
import styles from './ResetPasswordPage.module.css';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({ email });
      alert("Password reset instructions sent to your email.");
      navigate('/login');
    } catch (error) {
      alert("Reset failed: " + error.message);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Reset Password</h1>
        <form onSubmit={handleResetPassword}>
          <input
            className={styles.inputField}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className={styles.resetButton} type="submit">Reset Password</button>
        </form>
        <p className={styles.helperText}>
          Remembered your password? <a className={styles.helperLink} href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
