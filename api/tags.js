const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags()
    res.send({
        tags
    })
})

tagsRouter.get('/:tagName/posts',async (req,res,next) => {
    const {tagName} = req.params
console.log(tagName, "this is tagName")
    try {
        const arrPosts = await getPostsByTagName(tagName)
        console.log(arrPosts, "this is arrPosts")
        const filterPosts = arrPosts.filter((e) => {
            if(e.active){
                return true
            }

            if(req.user && e.author.id === req.user.id){
                return true
            }

            return false

        })

            res.send(filterPosts)

        
    } catch ({name,message}) {
        next({name,message})        
    }


})

module.exports = tagsRouter