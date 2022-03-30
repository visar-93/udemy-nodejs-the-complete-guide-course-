"use strict";

const http = require("http");

const express = require('express');

// function rqListener(req, res) {

const app = express();
// }
// takes a function called requestListener as an argument, and that
// request listener will be executed for every incoming request

const server = http.createServer(app);

server.listen(3000);
