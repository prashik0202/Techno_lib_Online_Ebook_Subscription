const mongoose = require('mongoose');
const Schema = mongoose.Schema;

primecustomerSchema = new Schema({

    unique_id: Number,
	email: String,
    city: String,
    state: String,
    pincode: String
});
primecustomer = mongoose.model('primecustomer',primecustomerSchema);

module.exports = primecustomer; 
