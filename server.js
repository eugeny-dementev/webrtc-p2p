const express = require('express');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3030;

const app = express();
const server = http.createServer(app);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/index.html')); 
});

server.listen(PORT, () => {
  console.log('Server is strated on', PORT);
});
