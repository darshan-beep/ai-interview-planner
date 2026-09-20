const express = require('express');
const cors = require('cors');
const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:4173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
const cookieparser = require('cookie-parser');
const interviewrouter = require('./routes/interviewrouter')
app.use(express.json());
app.use(cookieparser());
app.use( '/api/interview',interviewrouter)

const authrouter = require("./routes/auth.routes")
app.use("/api/auth",authrouter)
module.exports = app;