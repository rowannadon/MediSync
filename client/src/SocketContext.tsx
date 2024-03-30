import { createContext, useContext } from 'react';
import io, { Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = (props: any) => {
  const websocketURL = `ws://${window.location.hostname}:${window.location.port}`;
  const socket = io(websocketURL);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
