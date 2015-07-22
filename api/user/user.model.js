// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Define our user schema
var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	//token:{type: String},
	roles:[{type:String}]
});

UserSchema.methods.toJSON = function() {
	return {
		_id: this._id,
		name: this.name,
		email: this.email
	};
};

UserSchema.methods.generateHash = function (password) {
	var salt = bcrypt.genSaltSync(10);
	return bcrypt.hashSync(password, salt);
};

UserSchema.methods.comparePassword = function (password){
	var that = this;
	return bcrypt.compareSync(password, that.password);
};


// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);