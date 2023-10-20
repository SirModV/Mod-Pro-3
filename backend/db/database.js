const mongoose = require('mongoose');

connect = () => {
  mongoose.connect(process.env.MongoDb).then(() => {
    console.log('MongoDB connected');
  }).catch((err) => {
    console.log(`MongoDB cant connect ${err}`)
  })
}

module.exports = connect;