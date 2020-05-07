const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');
const UserSchema = new Schema({
    email:{
        type:String
    },
    user_team_details:{
        items:[{
            team_id:{
                type:Schema.ObjectId,
                required:true
            },
            name:{
                type:String,
                default:null
            },
            password:{
                type:String,
                default:null
            },
            jwt:{
                type:String,
                default:null
            },
            invitation:{
                invites:{
                    token:String,
                    accpected:Boolean
                }
            },
            is_admin:Boolean,
            is_user_active:{
                type:Boolean,
                default:false
            }
        }]
    }
})

UserSchema.plugin(timestamps);
var User = mongoose.model('User', UserSchema);

module.exports = User;