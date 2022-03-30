"use strict";
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require("./controllers/error.js");
const User = require("./models/user");
const MONGODB_URI ="mongodb+srv://user:password@cluster1.epldc.mongodb.net/project?retryWrites=true&w=majority";


// const expressHbs = require('express-handlebars');

const { nextTick } = require("process");

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, 'images');
  } ,
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb)=> {
  if(file.mimetype === 'image/png' 
    || file.mimetype === 'image/jpg' 
    || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

// tell express to compile dynamic template with pug engine, and
// where to find these tempaltes
// app.set('view engine', 'pug');
// app.set('views', 'views');

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const authRoutes = require("./routes/auth.js");

// db.execute('SELECT * FROM products')
// .then( result => {
//     console.log(result[0], result[1]);
// })
// .catch(err => {
//     console.log(err);
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('image'));

app.use(express.static(path.join(__dirname, "public")));
app.use('/images',express.static(path.join(__dirname, "images")));
app.use(session({
  secret: 'my secret',
  resave: false, // session will not be saved in every request
  saveUninitialized: false, // ensure that no session will be saved for not necessary requests to be save
  store: store,
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');

  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if(!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err =>{
      next(new Error(err));
    });
});

// static method serves static files

// app.use((req, res, next) => {
//     User.findById('6103bf69044b822cdc555ef1')
//     .then(user => {
//         req.user = user;
//         next();
//     })
//     .catch(err => console.log(err));
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(....)
  // res.redirect('/500');
  res.status(500).render('500', 
    {
        pageTitle: 'Error!', 
        path: '/500', 
        isAuthenticated: req.session.isLoggedIn
    });
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

// mongoConnect(() => {
//   app.listen(3000);
// });

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
