'use strict'

const express = require('express');
const path = require('path');

const rootDir = require('../util/path.js');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
    // console.log('In another middleware!');
    res.sendFile(path.join(rootDir,'views','add-product.html'));
});
// same path can be used if the method is different
// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;

