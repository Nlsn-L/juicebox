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

    try {
        const tags = await getPostsByTagName(tagName)
        if (tags){
            res.send(tags)
        }else{
            next();
        }

        
    } catch ({name,message}) {
        next({name,message})        
    }


})

module.exports = tagsRouter