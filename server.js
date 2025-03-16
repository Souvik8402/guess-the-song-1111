const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const rooms = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  // Create a room
  socket.on('createRoom', () => {
    const roomCode = Math.random().toString(36).substring(7);
    rooms[roomCode] = { players: [socket.id], score: 0 };
    socket.join(roomCode);
    socket.emit('roomCreated', roomCode);
  });

  // Join a room
  socket.on('joinRoom', (roomCode) => {
    if (rooms[roomCode]) {
      rooms[roomCode].players.push(socket.id);
      socket.join(roomCode);
      socket.emit('joinedRoom', roomCode);
      io.to(roomCode).emit('updateScore', rooms[roomCode].score);
    } else {
      socket.emit('invalidRoom');
    }
  });

  // Submit a song
  socket.on('submitSong', ({ roomCode, songName }) => {
    console.log(`Song submitted: ${songName}`);
    io.to(roomCode).emit('playSong', 'path/to/instrumental.mp3'); // Replace with actual song URL
  });

  // Submit a guess
  socket.on('submitGuess', ({ roomCode, guess }) => {
    const room = rooms[roomCode];
    if (guess === 'correctSongName') { // Replace with actual logic to check the guess
      room.score += 1;
      io.to(roomCode).emit('guessResult', 'Correct!');
    } else {
      io.to(roomCode).emit('guessResult', 'Wrong!');
    }
    io.to(roomCode).emit('updateScore', room.score);
    io.to(roomCode).emit('switchTurn');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
