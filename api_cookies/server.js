const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

app.use(express.json());

const authRoutes = require("./controllers/auth.controller");
const postsRoutes = require("./controllers/posts.controller");
const authenticateToken = require("./middleware/auth.middleware");
const JWT_SECRET = process.env.JWT_SECRET;


const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);


app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello, ${req.user.username}! You have access to this route.` });
});

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
