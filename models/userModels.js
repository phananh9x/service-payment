var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSchema = new Schema({
  so_tien : {
    type : Number
  },
  pin: {
    type: String,
    required:true,
    default: 500000
  },
  email : {
    type : String,
    unique: true,
    required:true
  },
  ten: {
    type: String
  },
  sdt: {
    type: String
  },
  dia_chi : {
    type : String
  }
});

mongoose.model('User', UserSchema);