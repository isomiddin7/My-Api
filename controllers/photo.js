require("dotenv").config();
const express = require("express");
const router = express.Router();
const Photo = require("../models/photo");
const redis = require("redis");

router.get('/', async function(req, res){
   await Photo.find({}).exec(function(err, items){
        if(err) {
            res.send('error has occured');
        } else {
            res.json(items);
        }
    });
});

router.get('/:id', async function(req, res){
    if(!req.params.id){
        return res.status(400);
    }
    const client = redis.createClient({
        url: process.env.REDIS_ENDPOINT,
        password:  process.env.REDIS_PASSWORD
    });
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
    let existingPhoto =  await client.get(req.params.id);

    if(!existingPhoto){
        await  Photo.findOne({
            _id: req.params.id
        }).exec(async function(err, item){
            if(err) {
                return res.send('error has occured');
            } else {
                existingPhoto = item;
                await client.set(item._id, JSON.stringify(item));
                return res.send(existingPhoto);
            }
        });
    }
    else {
        return res.send(existingPhoto);
    }

});

router.post('/', async function(req, res){
    const newPhoto = new Photo();
    newPhoto.albumId = req.body.albumId;
    newPhoto.title = req.body.title;
    newPhoto.category = req.body.category;
    newPhoto.thumbnailUrl = req.body.thumbnailUrl;

    await newPhoto.save(function(err, item){
        if(err) {
            res.send('error saving photo');
        } else {
            console.log(item);
            res.send(item);
        }
    });
});

router.put('/:id', async function(req, res){
    await Photo.findOneAndUpdate({
        _id: req.params.id
    },{
        $set: {
            title: req.body.title,
            albumId: req.body.albumId,
            category: req.body.category,
            thumbnailUrl: req.body.thumbnailUrl
        }
    },{
        upsert: true
    },function(err, newBook){
        if(err) {
            res.send('error updating Photo');
        } else {
            console.log(newBook);
            res.send(newBook);
        }
    });
});

router.delete('/:id', async function(req, res){
    await Photo.findByIdAndRemove({
        _id: req.params.id
    },function(err, book){
        if(err) {
            res.send('error deleting Photo');
        } else {
            console.log(book);
            res.send(book);
        }
    });
});

module.exports = router;

