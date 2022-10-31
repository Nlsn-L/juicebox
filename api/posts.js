const express = require('express');
const postsRouter = express.Router();
const { getAllPosts, createPostTag, createPosts } = require("../db")
const { requireUser } = require("./utils");

postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;

    const tagArr = tags.trim().split(/\s+/)
    const postData ={title, content, authorId: req.user.id}
console.log(req.user, "This works")

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

module.exports = postsRouter