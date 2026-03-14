const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Statik dosyaları (HTML, VRM, Resimler) sunar
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Bir kullanıcı bağlandı:', socket.id);

  // Remote'dan gelen her şeyi Host'a yayınla
  socket.on('remote-command', (data) => {
    io.emit('host-receive', data);
  });

  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı.');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});