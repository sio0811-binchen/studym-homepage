import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface DrowsinessAlert {
    studentName: string;
    recordId: string;
}

export const useNotifications = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [alerts, setAlerts] = useState<DrowsinessAlert[]>([]);

    useEffect(() => {
        // Connect to WebSocket server
        const newSocket = io('http://localhost:3000', {
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            console.log('WebSocket connected');
        });

        newSocket.on('drowsinessAlert', (data: DrowsinessAlert) => {
            console.log('Drowsiness alert received:', data);
            setAlerts(prev => [...prev, data]);

            // Play notification sound
            try {
                const audio = new Audio('/notification.mp3');
                audio.play().catch(err => console.log('Audio play failed:', err));
            } catch (err) {
                console.log('Audio not available');
            }
        });

        newSocket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const clearAlert = (index: number) => {
        setAlerts(prev => prev.filter((_, i) => i !== index));
    };

    const clearAllAlerts = () => {
        setAlerts([]);
    };

    return {
        socket,
        alerts,
        clearAlert,
        clearAllAlerts,
    };
};
