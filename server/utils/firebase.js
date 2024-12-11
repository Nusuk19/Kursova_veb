const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDPJ0qxQ-6WLR8wdH2fnV8folKGONiYluw",
  authDomain: "organiser-b8c29.firebaseapp.com",
  projectId: "organiser-b8c29",
  storageBucket: "organiser-b8c29.appspot.com",
  messagingSenderId: "265740200603",
  appId: "1:265740200603:web:7ca8311e09fb7fa617743e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = { auth, db };
