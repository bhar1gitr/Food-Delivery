const express = require('express');
const router = express.Router();
const User = require("../models/User");
const {body,validationResult} = require('express-validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const { register,login,logout,followUnFollowUser } = require('../controllers/users.js');
// const { isAuthenticated } = require('../middlewares/auth.js');


router.post("/createuser",[
body('email').isEmail(),
body('password').isLength({min : 5}),
body('name').isLength({min : 5})
],async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password,salt);

    try {
       await User.create({
            name: req.body.name,
            password: secPassword,
            email: req.body.email,
            location:req.body.location
        });
        res.json({
            success: true
        });
    } catch (error) {
        console.log(err);
        res.json({
            success: false
        })
    }
})
// router.post("/login",login)
// router.get("/follow/:id",isAuthenticated,followUnFollowUser)
// router.get("/logout",logout)


router.post("/loginuser",[
    body('email').isEmail(),
    body('password').isLength({min : 5})
],async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const  email= req.body.email
        try {
          const userData = await User.findOne({email});
          if(!userData){
            return res.status(400).json( {errors : "Try login with correct credentials"} )
          }
          const pwdcompare = await bcrypt.compare(req.body.password,userData.password);
          if(!pwdcompare){
            return res.status(400).json( {errors : "Try login with correct credentials"} )
        }
        
        const data = {
            user:{
                id:userData.id
            }
        }

        const authToken = jwt.sign(data,process.env.SECRET_KEY)

        return res.json({
            success:true,authToken:authToken
        })
        
        } catch (error) {
            console.log(err);
            res.json({
                success: false
            })
        }
    })

module.exports = router;