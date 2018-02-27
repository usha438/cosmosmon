//Requiring Mongoose
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

//Defining Schema
var loginSchema = mongoose.Schema({
   userid: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});



// generating a hash
loginSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
loginSchema.methods.validPassword = function(password,password1) {
    return bcrypt.compareSync(password,password1 );
};

//Exporting the file
var User = module.exports = mongoose.model('user_colls', loginSchema); //Binding schema to UserCollection 

//Getting user Details By Id
module.exports.getUserByField = function(user, callback) {
    User.find(user,callback);
}

//Inserting student Details
module.exports.addUser = function(user, callback) {
    User.create(user, callback);
}