//Requiring Mongoose
var mongoose = require('mongoose');

//Defining Schema
var userSchema = mongoose.Schema({

    _id: {
        type: String,
        required: true
    },

    Name: {
        type: String,
        required: true
    },

    Email: {
        type: String,
        required: true
    },

    PhoneNumber: {
        type: String,
        required: true
    },

    Designation: {
        type: String,
        required: true
    },

    Department: {
        type: String,
        required: true
    },
	
    create_date: {
        type: Date,
        default: Date.now
    }
});

//Inserting user Details
module.exports.addUser = function(user, callback) {
    User.create(user, callback);
}

