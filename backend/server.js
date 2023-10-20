const app = require('./app');
const connect = require('./db/database.js');
const cloudinary = require("cloudinary");

connect();

cloudinary.config({
  cloud_name: process.env.CloudName,
  api_key: process.env.CloudApi,
  api_secret: process.env.CloudSecret,
});

app.listen(8000, () => {
  console.log(`Server is working`);
});