"use strict";

const http = require("http");
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const { nextTick } = require("process");

const app = express();

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({extended: false})); 
app.use(express.static(path.join(__dirname, 'public')));
// static method serves static files

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
});


// callback will be executed for every coming request, and receives 3 arguments,
// request and response objects, and the next argument
// next is a function that will be passed to this callback function by express.js, and
// has to be executed to a loudy request to travel on to the next middleware

// app.use( (req, res, next) => {
//     console.log('In another middleware!');
//     res.send('<h1>Hello  from Express!</h1>');
// });

// app.use( (req, res, next) => {
//     const url = req.url;
//     console.log(`In the second middleware! We have url: ${url}`);
//     next();
// });
// app.use( (req, res, next) => {
//     const url = req.url
//     const method = req.method;
//     console.log(`In the third middleware! We have url: ${url}
//     from the previous middleware and the method from this: ${method}`);
//     res.send(`Hello from Espress.js
//     url: ${url}
//     method: ${method}`);
// });









// const server = http.createServer(app);4
// server.listen(3000);
app.listen(3000);