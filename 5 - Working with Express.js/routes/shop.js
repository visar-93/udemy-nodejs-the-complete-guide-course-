'use strict'

const path = require('path');

const express = require('express');

const rootDir = require('../util/path.js');

const router = express.Router();

router.get('/', (req, res, next) => {
    // console.log('In another middleware!');
    res.sendFile(path.join(rootDir ,'views', 'shop.html')); 
    // __dirname - global variable which holds an absolute path on our operating system to this project folder
    // '../ - go up one level (since views is sibling folder of route.js, and dirname will point in the route.js )
});

module.exports = router;