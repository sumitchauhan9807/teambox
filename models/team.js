const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');

const TeamSchema = new Schema({
    team_url:{
        type:String,
        unique:true,
        lowercase: true,
        required:true
    },
    team_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    } 
  });
  TeamSchema.plugin(timestamps);
  var Team = mongoose.model('Team', TeamSchema);
  module.exports = Team;
