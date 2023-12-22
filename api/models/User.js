const mongoose = require('mongoose');
// getting schema object from mongoose
const {Schema} = mongoose; 

// schema = structure for a table in a database
// used to ensure that every new entry in a table follows the same structure
const UserSchema = new Schema({
    name: String,
    email: {type:String, unique:true},
    password: String,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;