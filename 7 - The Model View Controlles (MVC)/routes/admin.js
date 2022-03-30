'use strict'

const express = require('express');
const path = require('path');

const productsController = require('../controllers/products.js');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);

// same path can be used if the method is different
// /admin/add-product => POST
router.post('/add-product', productsController.postAddProduct);

module.exports = router;

