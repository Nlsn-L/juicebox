const PORT = 3000;
const express = require("express");
const server = express();

const apiRouter = require('./api');
server.use('/api',apiRouter);


// server.use((req,res,next) => {
    


//     next();
// })







server.listen(PORT,() => {
    console.log("The server is up on",PORT)
})