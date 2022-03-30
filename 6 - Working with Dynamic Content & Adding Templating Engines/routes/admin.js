'use strict'

const express = require('express');
const path = require('path');

const rootDir = require('../util/path.js');

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
    // console.log('In another middleware!');
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('add-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product', 
        formsCSS:true, 
        productCSS:true, 
        activeAddProduct: true
    });
});

// same path can be used if the method is different
// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
    products.push({title: req.body.title});
    res.redirect('/');
});

exports.routes = router;
exports.products = products;

