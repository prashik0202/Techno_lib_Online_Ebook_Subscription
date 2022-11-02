const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const freebookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author:{
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  date:{
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  },
  para1: {
    type: String,
    required: true
  },
  para2: {
    type: String,
    required: true
  },
  para3: {
    type: String,
    required: true
  },
  para4: {
    type: String,
    required: true
  },
}, { timestamps: true });

const Freebook = mongoose.model('Freebook', freebookSchema);
module.exports = Freebook;