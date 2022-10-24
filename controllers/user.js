require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email: email});
    if(!user) {
        return res.status(404).send({message: "User not found"});
    }
    if(password !== user.password) {
        return res.status(404).send({message: "Password is incorrect"});
    }
    const token = await jwt.sign({ foo: 'bar' }, process.env.ACCESS_TOKEN);

    return res.status(200).send({message: "Success", token: token});
});

router.post("/sign-up", async (req, res) => {
    const {email, password, name} = req.body;
    const user = await User.findOne({email: email});
    if(user) {
        return res.status(404).send({message: "User already exists"});
    }
    const newUser = await User.create({email: email, password: password, name: name});
    console.log(newUser);
    const token = await jwt.sign({ foo: 'bar' }, process.env.ACCESS_TOKEN);

    return res.status(200).send({message: "Success", token: token, user: newUser});
});

module.exports = router;
