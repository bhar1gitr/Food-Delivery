const express = require ('express');
const mongoose = require( 'mongoose');

const Post = require('../models/Post.js');
const User = require('../models/User.js');


// const router = express.Router();

exports.getPosts = async (req, res) => { 
    try {
        const postMessages = await Post.find();
                
        
        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

exports.createPost = async (req, res) => {

    try {
    const newPostData = {
        caption : req.body.caption,
        image : {
            public_id: "req.body.public_id",
            url:"req.body.url",
        },
        owner : req.user._id
    };

    const newPost = await Post.create(newPostData);
    console.log(newPost);
    const user = await User.findById(req.user._id);
    console.log(user);
    user.posts.push(newPost._id);

    await user.save();

        res.status(201).json({success:true, post:newPost, });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
    
}
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({
                success : false,
                message: "Post not found",
            })
        }

        if(post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success : false,
                message: "Unauthorized",
            })
        }

        await post.remove();

        const user = await User.findById(req.user._id);
        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index,1);
        await user.save();


        res.status(200).json({
            success : true,
            message: "Post Deleted",
        })
    
    
} catch (error) {
    res.status(500).json({success:false, message:error.message});
}
}

exports.likeUnlikePost = async (req, res) => {
  try {
    
    const post = await Post.findById(req.params.id);

    if(!post) {
        return res.status(404).json({
            success : false,
            message: "Page not found",
        })
    }

    if(post.likes.includes(req.user._id)){
        const index = post.likes.indexOf(req.user._id);
        post.likes.splice(index, 1);
        await post.save();

        return res.status(200).json({
            success: true,
            message: 'Post Unliked',
        });
    }else{
        post.likes.push(req.user._id)
        await post.save();
        return res.status(200).json({
            success: true,
            message: 'Post Liked',
        });
    } 

  } catch (error) {
    res.status(500).json({success:false, message: "Error: " + error.message});
  }
}

exports.getPostOfFollowing = async (req,res)=>{
    try { 
        const user = await User.findById(req.user._id)
        

        const posts = await Post.find({
            owner:{
                $in:user.following
            }
        })

        res.status(200).json({
            success: true,
            posts
        });

    } catch (error) {
        res.status(500).json({success:false, message: "Error: " + error.message});
    }
}

