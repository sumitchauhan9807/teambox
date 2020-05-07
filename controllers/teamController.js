const TeamModel = require('../models/team');
const UserModel = require('../models/user');
const nodemailer = require("nodemailer");
var mongoose = require('mongoose')
const emailTemplates = require('../email/emailTempates');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:'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'
    }
}))

function createTeam(payload,callbackRoute){
    const team = new TeamModel({
        email:payload.email,
        team_name:payload.team_name,
        team_url:payload.team_url
    })

    team.save().then((createdTeam)=>{
        createAdminUser(createdTeam).then((token)=>{
            var teamActivateLink = process.env.BASE_URL+'team/activate/'+token+'/'+createdTeam._id
            var emailData = {
                email:createdTeam.email,
                team_name:createdTeam.team_name,
                teamActivateLink:teamActivateLink
            }
            console.log(emailData)
             sendTeamVerificationEmail(emailData)
             callbackRoute(null,createdTeam)
        })
       
    }).catch((error)=>{
        callbackRoute(error,null)
    })
}


function createAdminUser(createdTeam){
    return new Promise((resolve,reject)=>{
        UserModel.findOne({email:createdTeam.email}).exec((error,userData)=>{
            if(userData){
                // email already exists
                var token = global.makeToken(15)
                console.log('email exists already')
                userData.user_team_details.items.push({
                    team_id:createdTeam._id,
                    is_admin:true,
                    is_user_active:false,
                    name:null,
                    password:null,
                    invitation:{
                        invites:{
                            token:token,
                            accpected:false
                        }
                    }
                })
                userData.save((userResult)=>{
                    console.log(userResult)
                    resolve(token);
                })
            }else{
                // email does not exists
                var token = global.makeToken(15)
                console.log('email does not exists')
                var userTeamDetails = {
                    items:[{
                        team_id:createdTeam._id,
                        is_admin:true,
                        is_user_active:false,
                        name:null,
                        password:null,
                        invitation:{
                            invites:{
                                token:token,
                                accpected:false
                            }
                        }
                    }]
                }
                const user = new UserModel({
                    email:createdTeam.email,
                    user_team_details:userTeamDetails
                })
                user.save((userResult)=>{
                    console.log(userResult)
                    resolve(token);
                })
            }
        })
    })
}


function sendTeamVerificationEmail(emailData){
    transporter.sendMail({
        to:emailData.email,
        from:"sumitkumarchauhan@gmail.com",
        subject:"Welcome to chat-box",
        html:emailTemplates.sendTeamConfirmationMail(emailData)
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
    console.log('sending mail');
}
//http://localhost:3000/team/activate/12345234456432/5eb3e615cb410817047e200d
function activateUser(token,team_id,callbackRoute){
    var query = {$and:[
        {"user_team_details.items.invitation.invites.token": token },
        {"user_team_details.items.team_id":team_id}
    ]}
    UserModel.findOne(query,{"user_team_details.items.$":1}).exec((error,result)=>{
    
        if(result){
            callbackRoute(null,result)
        }else{
            callbackRoute('invalid token',null)
        }
        
    })
}

function addUserData(payload,callbackRoute){
    var query = {$and:[
        {"user_team_details.items.invitation.invites.token": payload.token },
        {"user_team_details.items.team_id":payload.team_id}
    ]}
    UserModel.findOne(query,{"user_team_details.items.$":1}).exec((error,result)=>{
    
        if(result){
            //.
            console.log(result.user_team_details.items[0]._id)
            UserModel.updateOne({"user_team_details.items._id":result.user_team_details.items[0]._id},{
                $set:{
                    "user_team_details.items.$[t].name":payload.name,
                    "user_team_details.items.$[t].password":payload.password,
                    "user_team_details.items.$[t].is_user_active":true,
                    "user_team_details.items.$[t].invitation":{}
                }
                
            },
            { arrayFilters: [ { "t._id":  mongoose.Types.ObjectId(result.user_team_details.items[0]._id) } ],new: true}
            
            ).exec((error,updateresult)=>{
                console.log(error)
                console.log(updateresult);
                callbackRoute(null,result)
            })
            
        }else{
            callbackRoute('invalid token',null)
        }
        
    })
}
module.exports = {
    createTeam ,activateUser,addUserData
}