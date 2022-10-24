require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const user = require('./controllers/user');
const photo = require('./controllers/photo');
const auth = require('./authMiddleware');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;

db.on('error', function (err) {
    console.log(err);
});
db.once("open", () => console.log("connected"));

app.use("/",  user);
app.use("/photo", auth, photo);

app.listen(process.env.PORT || 5000)

