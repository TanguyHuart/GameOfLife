import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import bcrypt from "bcrypt"

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", async (socket) => {
    console.log('connecté au socket !', socket.id);
    socket.currentRoom = await bcrypt.hash(socket.id , 10)
    console.log(socket.currentRoom);
    
socket.join(socket.currentRoom)
socket.emit("room-name", socket.currentRoom);
socket.on ('join-room', (roomId) => {
  console.log('tu veux te connecter a la room :' + roomId);


if (io.sockets.adapter.rooms.get(roomId)) {
  socket.leave(socket.currentRoom)
  socket.currentRoom = roomId
        socket.join(socket.currentRoom);
        console.log(`Socket ${socket.id} a rejoint la room ${roomId}`);
        socket.emit("room-joined", roomId);

        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        const hostSocketId = clients[0]; // Le premier client est considéré comme "host"

        if (hostSocketId && hostSocketId !== socket.currentRoom) {
          // Demander la grille à l'hôte
          io.to(hostSocketId).emit('request-grid', { targetSocketId: socket.id });
        }
      } else {
        console.log(`Room ${roomId} n'existe pas.`);
        socket.emit("error-joining-room", `Room ${roomId} n'existe pas.`);
      }
});

socket.on('provide-grid', ({ targetSocketId, grid }) => {
  console.log(`Grille reçue de ${socket.id} pour ${targetSocketId}`);
  io.to(targetSocketId).emit('responseGrid', grid);
});

    socket.on('grid', (value) =>{
      console.log(`Socket ${socket.id} a envoyé une grille à sa room : ${socket.currentRoom}`);
      io.to(socket.currentRoom).emit('responseGrid', value )
      
    })

    socket.on('runButton', (value) => {
      io.to(socket.currentRoom).emit('responseRun', value)
    })

    socket.on('resetButton', (value) => {
      io.to(socket.currentRoom).emit('responseReset', value)
    })

    socket.on('clearButton', () => {
      io.to(socket.currentRoom).emit('responseClear')
    })

    socket.on('intervalSlider', (value) => {
      io.to(socket.currentRoom).emit('responseInterval', value)
    })

    socket.on("disconnect", () => {
      console.log(`Socket déconnecté : ${socket.id}`);
    });
  })

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});