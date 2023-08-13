const express = require('express');
const router = express.Router();

// const { getPosts, createPost, updatePost, likeUnlikePost, deletePost ,getPostOfFollowing } = require('../controllers/posts.js')

// const { isAuthenticated } = require('../middlewares/auth.js');


// router.get('/', getPosts);
router.post('/foodData',(req,res)=>{
    try {
        res.send([global.food_items,global.foodCategory]);
    } catch (error) {
        console.log(error);
    }
});
// router.patch('/:id', updatePost);
// router.delete('/post/:id',isAuthenticated,deletePost);
// router.get('/post/:id',isAuthenticated,likeUnlikePost);
// router.get('/posts',isAuthenticated,getPostOfFollowing)



module.exports = router;