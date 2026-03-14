const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfada host.html çalışsın
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'host.html'));
});

io.on('connection', (socket) => {
  console.log('Yeni bağlantı:', socket.id);

  // Kumandadan gelen komutu al ve HERKESE (Host dahil) gönder
  socket.on('remote-command', (data) => {
    console.log('Komut alındı:', data);
    io.emit('host-receive', data); // Bu satır host.html'e veriyi ulaştırır
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Sunucu ${PORT} portunda aktif.`);
});
