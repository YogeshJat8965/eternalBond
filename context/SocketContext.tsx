'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found, skipping socket connection');
      return;
    }

    // Initialize Socket.io connection
    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    
    console.log('Connecting to Socket.io server:', API_URL);
    
    const newSocket = io(API_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Connected to Socket.io server');
      setIsConnected(true);
      
      // Emit user:connect event
      newSocket.emit('user:connect', {});
    });

    newSocket.on('connected', (data) => {
      console.log('Server confirmed connection:', data);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.io server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
    });

    // User status events
    newSocket.on('user:online', (data: { userId: string; userName: string }) => {
      console.log('User came online:', data.userName);
      setOnlineUsers(prev => new Set(prev).add(data.userId));
    });

    newSocket.on('user:offline', (data: { userId: string }) => {
      console.log('User went offline:', data.userId);
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up socket connection');
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, []); // Empty dependency array - only run once

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
