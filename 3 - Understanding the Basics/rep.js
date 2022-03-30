'use stricts'

const http = require('http');
const fs = require('fs');

// .createServer returns a server
// We store that server on a variable called server
const server = http.createServer((req, res) => {
    
    const url = req.url;
    const method = req.method;

    if(url === '/') {
        res.setHeader('Content-type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Enter Message</title><head>');
        res.write('<body><form action ="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end(); // to return the program from this function and not continue with the following response code
    }

    if(url === '/message' && method ==='POST') {
        const body = [];
        // getting requests data , on - allows us to listen certain events (data event)
        // data event will be fired whenever a new chunk is ready to be read
        // arguments of 'on' : data event, a function that should be executed for every data event 
        req.on('data', (chunk)=> {
            console.log(chunk);
            body.push(chunk);
        });
        // 'end' event listener will be fired when it's done parsing the incoming data
        // in the function we call relay on all chunks read in and stored in the body 
        // to work with all these chunks we need to buffer them 
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.writeFile('message2.txt', message, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }
    res.setHeader('Content-type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title><head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    res.end();
});
// listen starts a process where node.js will not immediately exit our script
// but instead will keep this running for incoming requests
server.listen(4000);