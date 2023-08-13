

const express = require('express');
const User =require('../models/User.js');


// const router = express.Router();

exports.register = async (req, res) => { 
    try {
            
        const {name,email,password} = req.body; 
        let user = await User.findOne({email})
        
        if(user) {
            return res.status(400).json({success:false, message:"User already exists"})
        }

        user = await User.create({name,email,password,avatar:{public_id:"sample_id",url:"sampleurl"}});

        const token = await user.generateToken();
        const options = {
            expires:new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly:true
        }

        res.status(201).cookie("token",token,options).json({
            success:true,user,token,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


exports.login = async (req,res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({ email }).select("+password");

        if(!user) {
            return res.status(400).json({success:false, message:"User does not exists"})
        }  
        
        const isMatch = await user.matchPassword(password);
        if(!isMatch) {
            return res.status(400).json({success:false, message:"Incorrect password"})
        }  

        const token = await user.generateToken();
        const options = {
            expires:new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly:true
        }

        res.status(200).cookie("token",token,options).json({
            success:true,user,token,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.logout = async (req,res) => {
    try {
        res.status(200).cookie("token",null,{expires:new Date(Date.now()),httpOnly
        : true}).json({
            success: true,
            message: "Logged Out",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.followUnFollowUser = async (req,res) => {
    try {

        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);
        
        if(!userToFollow){
            return res.status(404).json({
                success : false,
                message : 'User not found',
            })
        }

        // console.log(loggedInUser._id);
        // console.log(userToFollow._id);
        //  if(loggedInUser._id === userToFollow._id){
        //     return  res.status(400).json({
        //         success: false,
        //         message: "You can't follow yourself",
        //     })
        // }

        if(loggedInUser.following.includes(userToFollow._id)){
            const indexOfFollowing = loggedInUser.following.indexOf(userToFollow._id);
            const indexOfFollowers = userToFollow.followers.indexOf(loggedInUser._id);

            loggedInUser.following.splice(indexOfFollowing,1)
            userToFollow.followers.splice(indexOfFollowers,1)

            await loggedInUser.save();
            await userToFollow.save();

            return res.status(400).json({
                success : true,
                message: "User Unfollowed",
            })
        }else{
            loggedInUser.following.push(userToFollow._id);
            userToFollow.followers.push(loggedInUser._id);

            await loggedInUser.save();
            await userToFollow.save();

            res.status(200).json({
                success: true,
                message: "User followed",
            })
        }
      
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.updatePassword = async (req,res) => {
    try {
        const user = await User.findById(req.user._id);

        const {oldPassword,newPassword} = req.body;

        const isMatch = await user.matchPassword(oldPassword);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                messgae: "Incorrect old password",
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(400).json({
            success: false,
            messgae: "Password updated",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}