import { io } from 'socket.io-client';

let socketInstance;

export const getSocketClient = () => {
  if (!socketInstance) {
    socketInstance = io(import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:5000', {
      autoConnect: false,
      withCredentials: true,
    });
  }
  return socketInstance;
};
