const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");

const user = require('./routes/userRoutes.js');

const errorMiddleware = require('./middlewares/error.js');

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(fileUpload());
app.use(bodyParser.urlencoded({
  extended: true,
  limit: "50mb"
}));
app.use(cors({
  origin: true
}));

// Routes

app.use('/api/v1', user);

// Middleware

app.use(errorMiddleware);

module.exports = app;