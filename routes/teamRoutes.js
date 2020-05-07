const express = require('express');
const Router = express.Router()
const teamController = require('../controllers/teamController');
const {body, check, validationResult } = require('express-validator');
var multer  = require('multer')
var upload = multer({})


Router.post('/team',upload.single('avatar'),[
    body('email','Invalid email').isEmail(),
    body('team_url' ,'team_url is required').notEmpty(),
    body('team_name','team_name is required').notEmpty()
],(req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    teamController.createTeam(req.body,(error,result)=>{
        if(error){
            return res.status(422).send(error)
        }
        res.status(201).send(result);
    })
})

Router.get('/activate/:token/:team_id',(req,res,next)=>{
    console.log(req.params);
    let token = req.params.token;
    let team_id = req.params.team_id
    teamController.activateUser(token,team_id,(error,result)=>{
        if(error){
            return res.status(422).send({
                message:error
            })
        }
        res.status(200).send(result);
    })
})

Router.post('/user',upload.single('avatar'),[
    body('token','token is required').notEmpty(),
    body('team_id','team_id is required').notEmpty(),
    body('name' ,'name is required').notEmpty(),
    body('password','password is required').notEmpty()
],(req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    teamController.addUserData(req.body,(error,result)=>{
        if(error){
            return res.status(422).send({
                message:error
            })
        }
        res.status(200).send(result);
    })
})


module.exports = Router;