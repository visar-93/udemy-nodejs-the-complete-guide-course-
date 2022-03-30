const path = require('path');

module.exports = path.dirname(process.mainModule.filename);


// __dirname - global variable which holds an absolute path on our operating system to this project folder
    // '../ - go up one level (since views is sibling folder of route.js, and dirname will point in the route.js )