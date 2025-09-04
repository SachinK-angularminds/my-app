import { createContext, useContext, useEffect, useRef, useState } from "react";
import type{ ReactNode } from "react";
import { io, Socket } from "socket.io-client";


interface SocketContext {
  message:string,
  handleSubmit:(e: React.FormEvent<HTMLFormElement>)=>void,
  setMessage: React.Dispatch<React.SetStateAction<string>>
}

const SocketContext = createContext<SocketContext | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");

 const socketRef = useRef<Socket | null>(null);

useEffect(() => {
      socketRef.current = io("http://localhost:5000");

    socketRef.current.on("connect", () => {
      console.log("Connected to server:", socketRef.current?.id); // Unique socket identifier
    });
    socketRef.current.on("chat message", (msg: string) => {
      console.log(msg);
    });

    return () => {
    socketRef.current?.disconnect();
    socketRef.current = null;
  };
  }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(message);
    
      socketRef.current?.emit("chat message", message);
      setMessage("");
   
  };

  return (
    <SocketContext.Provider value={{handleSubmit,message, setMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContext => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
