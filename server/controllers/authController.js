const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} = require('firebase/auth');
const { auth, db } = require('../utils/firebase');
const { getDoc } = require("firebase/firestore");
const { doc, setDoc } = require("firebase/firestore");
const { query, where, getDocs, collection } = require("firebase/firestore");

// Отримання даних профілю користувача
const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      res.status(200).json(userDoc.data());
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};


const checkEmailAndRegister = async (email, password, additionalData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await createUserDatabase(userCredential.user.uid, additionalData, userCredential.user.email);

    return { success: true, user: userCredential.user };
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return { error: "This email is already registered. Please login." };
    }
    throw error;
  }
};

// Функція для створення бази даних для користувача
async function createUserDatabase(userId, additionalData, email) {
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      username: additionalData.username,
      name: additionalData.name,
      email: email,
      createdAt: new Date().toISOString(),
      projects: []
    });
    console.log("User database created successfully for user:", userId);
  } catch (error) {
    console.error("Error creating user database:", error);
  }
}

// Реєстрація нового користувача
const registerUser = async (req, res) => {
  const { email, password, username, name } = req.body;

  if (!email || !password || !username || !name) {
    return res.status(400).json({ error: "Email, password, username, and name are required." });
  }

  try {
    const result = await checkEmailAndRegister(email, password, { username, name });

    if (result.error) {
      return res.status(200).json({ message: result.error });
    }

    res.status(201).json({ message: "User registered successfully", user: result.user });
  } catch (error) {
    console.error("Registration error:", error);

    let errorMessage = "An error occurred during registration.";
    switch (error.code) {
      case "auth/invalid-email":
        errorMessage = "Invalid email address.";
        break;
      case "auth/weak-password":
        errorMessage = "Password is too weak.";
        break;
    }

    res.status(400).json({ error: errorMessage });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    res.status(200).json({ message: "Login successful", user: userCredential.user });
  } catch (error) {
    console.error("Login error:", error);

    let errorMessage = "An error occurred during login.";
    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "No user found with this email.";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password.";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address.";
        break;
    }

    res.status(400).json({ error: errorMessage });
  }
};

// Відновлення паролю
const resetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    await sendPasswordResetEmail(auth, email);
    res.status(200).json({ message: "Password reset instructions sent." });
  } catch (error) {
    console.error("Password reset error:", error);

    let errorMessage = "An error occurred while sending password reset instructions.";
    if (error.code === "auth/user-not-found") {
      errorMessage = "No user found with this email.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address.";
    }

    res.status(400).json({ error: errorMessage });
  }
};

const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const userData = req.body;

  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, userData, { merge: true });
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = { registerUser, loginUser, resetPassword, getUserProfile, updateUserProfile };