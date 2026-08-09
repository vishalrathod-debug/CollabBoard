import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "../services/socketService";
import { SocketContext } from "./SocketContext.js";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const newSocket = connectSocket(token);
    const handleConnect = () => setSocket(newSocket);
    newSocket.on("connect", handleConnect);

    return () => {
      disconnectSocket();
      newSocket.off("connect", handleConnect);
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
