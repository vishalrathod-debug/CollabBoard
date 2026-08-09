import { useContext } from "react";
import { SocketContext } from "../context/SocketContext.js";

// The app owns one authenticated Socket.IO connection in SocketProvider.
// BoardRoom uses this hook to access that client after it is connected.
export const useSocket = () => useContext(SocketContext);
