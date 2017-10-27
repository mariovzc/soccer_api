var mongoose = require('mongoose')
var Schema = mongoose.Schema

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: [true, 'Email Must Be Unique'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true
  },
  leage: {
    type: Number,
    required: true
  },
  token: String
}))
