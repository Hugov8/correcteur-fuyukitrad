const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  let index = path.join(__dirname, 'build', 'index.html') 
  if (isValidPath(index)) {
    res.sendFile(index);
  }
});

app.listen(3000);