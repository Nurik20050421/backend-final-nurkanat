const mongoose = require('mongoose');

const Item = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PortfolioItem = mongoose.model('PortfolioItem', Item);

module.exports = PortfolioItem;
