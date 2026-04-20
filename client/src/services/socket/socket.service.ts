import { io as SocketIO, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = SocketIO(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      withCredentials: true,
      autoConnect: true,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
