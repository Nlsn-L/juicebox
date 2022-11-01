const express = require('express');
const postsRouter = express.Router();
const { getAllPosts, createPostTag, createPosts, getPostById, updatePosts } = require("../db")
const { requireUser } = require("./utils");


postsRouter.patch('/:postId',requireUser, async (req,res,next) => {
    const {postId} = req.params
    const {title,content,tags} = req.body
    const updateFields = {}

    if (tags && tags.length > 0){
        updateFields.tags = tags.trim().split(/\s+/)
    }

    if (title){
        updateFields.title = title
    }

    if (content){
        updateFields.content = content
    }

    try {
        const originalPost = await getPostById(postId)

        if (originalPost.author.id === req.user.id){
            const updatedPost = await updatePosts(postId,updateFields)
            res.send({post:updatedPost})
        } else{
            next({
                name: 'UnauthorizedUserError',
                message: 'You cannot update a post that is not yours'
            });
        }


    } catch ({name,message}) {
        next({name,message})
    }





})





postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;

    const tagArr = tags.trim().split(/\s+/)
    const postData ={title, content, authorId: req.user.id}

    if (tagArr.length) {
        postData.tags = tagArr
    }

    try {
        
        const post = await createPosts(postData);

        if(post) {
            res.send( post )
        } else {
            next();
        }

    } catch ({name, message}) {
        next({name, message})
    }

})

postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts")

    next();
});
postsRouter.get('/', async (req, res) => {
    const posts = await getAllPosts()
    
    res.send({
        posts
    });
});

postsRouter.delete('/:postId',requireUser,async (req,res,next) => {

    try {
        const post = await getPostById(req.params.postId);

        if (post && post.author.id === req.user.id){
            const updatedPost = await updatePosts(post.id,{active: false});
            res.send({post: updatedPost})
        }else{
            next(post ? {
                name: "UnauthorizedUserError",
                message: "You cannot delete a post which is not yours"
            }:{
                name: "PostNotFoundError",
                message: "That post does not exist"
            });
        }


    } catch ({name,message}) {
        next({name,message})
    }


})





module.exports = postsRouter