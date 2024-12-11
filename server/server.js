const cors = require('cors');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.options('*', cors());

app.use(express.json());
app.use('/auth', authRoutes);
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  if (req.method !== "GET") {
    console.log("Request body:", { ...req.body, password: "****" });
  }
  next();
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
