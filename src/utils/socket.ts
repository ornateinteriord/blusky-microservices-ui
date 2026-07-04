import { io, Socket } from 'socket.io-client';
import TokenService from '../api/token/tokenService';

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
    const token = TokenService.getToken();
    const memberId = TokenService.getMemberId();

    if (socket) {
        // If user or token changed, disconnect stale socket and re-create
        if (socket.io.opts.query?.userId !== memberId || (socket.auth as { token?: string })?.token !== token) {
            socket.disconnect();
            socket = null;
        } else {
            if (!socket.connected) {
                socket.connect();
            }
            return socket;
        }
    }

    const apiUrl = import.meta.env.VITE_MLM_API_URL || 'http://localhost:5051';

    socket = io(apiUrl, {
        auth: { token },
        query: { userId: memberId }, // backend matches this to activeUsers map
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
    });

    // Connection event handlers
    socket.on('connect', () => {
        console.log('✅ Socket connected:', socket?.id, 'for user:', memberId);
    });

    socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
        console.error('🔴 Socket connection error:', error.message);
    });

    socket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
    });

    return socket;
};

export const getSocket = (): Socket | null => {
    return socket;
};

export const disconnectSocket = (): void => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log('🔌 Socket manually disconnected');
    }
};
