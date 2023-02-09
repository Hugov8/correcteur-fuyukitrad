const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

// set up rate limiter: maximum of five requests per minute
var RateLimit = require('express-rate-limit');
var limiter = RateLimit.rateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 5
});

// apply rate limiter to all requests
app.use(limiter);

app.get('/', function (req, res) {
  let index = path.join(__dirname, 'build', 'index.html') 
  if (isValidPath(index)) {
    res.sendFile(index);
  }
});

app.listen(3000);