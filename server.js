const express = require('express');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3030;

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/index.html')); 
});

io.on('connection', (socket) => {
  console.log('user connected to Socket.IO server', socket.id);
});

server.listen(PORT, () => {
  console.log('Server is strated on', PORT);
});
