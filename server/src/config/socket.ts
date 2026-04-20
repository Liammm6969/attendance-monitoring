import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer;

export const initSocket = (server: any, clientUrl: string) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: clientUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
