const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/final-db')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Failed to connect to MongoDB', err));