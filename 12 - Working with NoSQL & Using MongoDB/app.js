"use strict";
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error.js');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');


// const expressHbs = require('express-handlebars');

const { nextTick } = require("process");``

const app = express();

// tell express to compile dynamic template with pug engine, and 
// where to find these tempaltes
// app.set('view engine', 'pug');
// app.set('views', 'views');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

// db.execute('SELECT * FROM products')
// .then( result => {
//     console.log(result[0], result[1]);
// })
// .catch(err => {
//     console.log(err);
// });

app.use(bodyParser.urlencoded({extended: false})); 
app.use(express.static(path.join(__dirname, 'public')));
// static method serves static files

app.use((req, res, next) => {
    User.findById('60f970f65b14f299d3da97c6')
    .then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

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

mongoConnect(() => {
  app.listen(3000);
});
