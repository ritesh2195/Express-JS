const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have email id'],
    unique: true,
    lowecase: true,
    validate: [validator.isEmail, 'Please provide valid email id'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'confirm password is required'],
    minlength: 8,
    validate: {
      // this will only work on save
      validator: function (el) {
        return el === this.password;
      },
      message: 'confirm password should match with password',
    },
  },
  passwordChangeAt:{
    type:Date
  }
});

userSchema.pre('save', async function (next) {
  // run this function when password is modified

  if (!this.isModified('password')) return next();

  // hash the password

  this.password = await bcrypt.hash(this.password, 12);

  // delete confirm password

  this.confirmPassword = undefined;

  next();
});

userSchema.methods.validateUserPassword = async function(candidatePassword,userPassword){

  return await bcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.changePasswordAfter = function(JWTTimeStamp){

  if(this.passwordChangeAt){
    const changeTimeStamp = parseInt(this.passwordChangeAt.getTime()/1000,10)

    return JWTTimeStamp<changeTimeStamp
  }
  return false
}

const User = mongoose.model('User', userSchema);
module.exports = User;
