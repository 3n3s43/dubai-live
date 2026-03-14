const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Statik dosyaların yerini belirle (public klasörü)
app.use(express.static(path.join(__dirname, 'public')));

// ANA SAYFA DÜZELTMESİ: index.html yerine host.html'i açar
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'host.html'));
});

io.on('connection', (socket) => {
  console.log('Bir kullanıcı bağlandı:', socket.id);

  socket.on('remote-command', (data) => {
    io.emit('host-receive', data);
  });

  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı.');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Sunucu ${PORT} portunda başarıyla çalışıyor.`);
});
