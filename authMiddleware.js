require('dotenv').config();
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null)
        return  res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err) {
        if(err)
            return  res.setHeader("Content-Type", "application/json").status(401).json({message: "non authorized"});
        else
            return next();
    });
    return 0;
}

module.exports = auth;