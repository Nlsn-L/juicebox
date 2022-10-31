const express = require("express");
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const token = jwt.sign({id: 1, username: 'albert'}, process.env.JWT_SECRET) 
token;



const { getAllUsers, getUserByUsername } = require("../db")
usersRouter.use((req,res,next) => {
    console.log("A request is being made to /users")
    
    next();
});

usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers()

    res.send({
        users
    })
})

usersRouter.post('/login', async (req, res, next) => {
    const {username,password} = req.body;

    if (!username || !password) {
        next({
            name: "MissingCredentialError",
            message: "Please supply both a username and password"
        });
    }

    try {
        const user = await getUserByUsername(username);

        if (user && user.password == password) {
            res.send({message: "you're logged in!", token: token})
        } else {
            next({
                name: 'IncorrectCredentialError',
                message: 'Username or password is incorrect'
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = usersRouter;
