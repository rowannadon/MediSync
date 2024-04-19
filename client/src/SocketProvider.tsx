import { createContext, useContext, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { useRemoteDataStore } from './RemoteDataStore';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = (props: any) => {
    const websocketURL = `ws://${window.location.hostname}:${window.location.port}`;
    const socket = io(websocketURL);
    const setPathwayTemplates = useRemoteDataStore((state) => state.setPathwayTemplates);
    const setStageTemplates = useRemoteDataStore((state) => state.setStageTemplates);
    const setPeople = useRemoteDataStore((state) => state.setPeople);
    const setRooms = useRemoteDataStore((state) => state.setRooms);
    const setRunningPathways = useRemoteDataStore((state) => state.setRunningPathways);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('pathwayTemplates', (pathwayTemplates) => {
            setPathwayTemplates(pathwayTemplates);
        });

        socket.on('stageTemplates', (stageTemplates) => {
            setStageTemplates(stageTemplates);
        });

        socket.on('people', (people) => {
            setPeople(people);
        });

        socket.on('rooms', (rooms) => {
            setRooms(rooms);
        });

        socket.on('runningPathways', (runningPathways) => {
            setRunningPathways(runningPathways);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
};