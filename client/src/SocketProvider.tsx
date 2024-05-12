import { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useRemoteDataStore } from './RemoteDataStore';
import { useLocalDataStore } from './LocalDataStore';
import { useAuth } from './AuthProvider';
import { navigate } from 'wouter/use-browser-location';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = (props: any) => {
  const auth = useAuth();
  const token = auth?.getAccessToken();
  const [socket, setSocket] = useState<Socket | null>(null);

  const websocketURL = `ws://${window.location.hostname}:${window.location.port}`;

  useEffect(() => {
    if (token) {
      console.log('setting up socket with token', token);
      const newSocket = io(websocketURL, {
        auth: {
          token: token,
        },
      });
      setSocket(newSocket);
    }
  }, [token]);

  const setPathwayTemplates = useRemoteDataStore(
    (state) => state.setPathwayTemplates,
  );
  const setStageTemplates = useRemoteDataStore(
    (state) => state.setStageTemplates,
  );
  const setPeople = useRemoteDataStore((state) => state.setPeople);
  const setRooms = useRemoteDataStore((state) => state.setRooms);
  const setRunningPathways = useRemoteDataStore(
    (state) => state.setRunningPathways,
  );
  const setAssignments = useRemoteDataStore((state) => state.setAssignments);

  const setLockedPathways = useRemoteDataStore(
    (state) => state.setLockedPathways,
  );
  const setLockedStages = useRemoteDataStore((state) => state.setLockedStages);

  const selectedPathway = useLocalDataStore((state) => state.selectedPathway);
  const pathwayPageFocused = useLocalDataStore(
    (state) => state.pathwayPageFocused,
  );
  const stagePageFocused = useLocalDataStore((state) => state.stagePageFocused);
  const selectedStage = useLocalDataStore((state) => state.selectedStage);

  useEffect(() => {
    if (!socket) return;

    if (selectedPathway && pathwayPageFocused) {
      console.log('locking pathway', selectedPathway);
      socket.emit('lockPathway', selectedPathway.id);
    } else {
      console.log('unlocking pathway');
      socket.emit('unlockPathway');
    }
  }, [selectedPathway, pathwayPageFocused]);

  useEffect(() => {
    if (!socket) return;

    if (selectedStage && stagePageFocused) {
      console.log('locking stage', selectedStage);
      socket.emit('lockStage', selectedStage.id);
    } else {
      if (selectedStage) {
        console.log('unlocking stage');
        socket.emit('unlockStage');
      }
    }
  }, [selectedStage, stagePageFocused]);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('connect_error', () => {
      console.log('Disconnected from server');
      navigate('/login');
    });

    socket.on('lockedPathways', (lockedPathways: string[]) => {
      setLockedPathways(lockedPathways);
      console.log('locked pathways', lockedPathways);
    });

    socket.on('lockedStages', (lockedStages: string[]) => {
      setLockedStages(lockedStages);
      console.log('locked stages', lockedStages);
    });

    socket.on('pathwayTemplates', (pathwayTemplates) => {
      console.log('setting pathway templates');
      setPathwayTemplates(pathwayTemplates);
    });

    socket.on('stageTemplates', (stageTemplates) => {
      console.log('setting stage templates');
      setStageTemplates(stageTemplates);
    });

    socket.on('people', (people) => {
      console.log('setting people');
      setPeople(people);
    });

    socket.on('rooms', (rooms) => {
      console.log('setting rooms');
      setRooms(rooms);
    });

    socket.on('runningPathways', (runningPathways) => {
      console.log('setting running pathways');
      setRunningPathways(runningPathways);
    });

    socket.on('assignments', (assignments) => {
      console.log('setting assignments');
      setAssignments(assignments);
    });

    socket.on('Unauthorized', () => {
      console.log('Unauthorized socket.io request');
      auth?.logout();
      navigate('/login');
    });

    socket.emit('getInitialData');

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
