import { Client, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Use SockJS fallback if native WebSocket is not available or for better compatibility
// Note: You might need to install sockjs-client: npm install sockjs-client @types/sockjs-client

class SocketService {
    private client: Client;
    private connected: boolean = false;

    constructor() {
        this.client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // Adjust URL as needed
            debug: () => {
                // console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = () => {
            this.connected = true;
            console.log('Connected to WebSocket');
        };

        this.client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        this.client.onWebSocketClose = () => {
            this.connected = false;
            console.log('WebSocket connection closed');
        };
    }

    connect() {
        if (!this.client.active) {
            this.client.activate();
        }
    }

    disconnect() {
        if (this.client.active) {
            this.client.deactivate();
        }
    }

    subscribe(topic: string, callback: (message: any) => void): StompSubscription | { unsubscribe: () => void } {
        // Return a no-op subscription if not connected
        if (!this.client.active || !this.connected) {
            console.warn('Socket not connected, returning no-op subscription');
            return {
                id: '',
                unsubscribe: () => { /* no-op */ }
            } as StompSubscription;
        }

        try {
            return this.client.subscribe(topic, (message) => {
                callback(JSON.parse(message.body));
            });
        } catch (error) {
            console.error('Failed to subscribe to topic:', topic, error);
            return {
                id: '',
                unsubscribe: () => { /* no-op */ }
            } as StompSubscription;
        }
    }

    send(destination: string, body: any) {
        if (this.client.active && this.connected) {
            this.client.publish({
                destination: destination,
                body: JSON.stringify(body),
            });
        } else {
            console.warn('Cannot send message, socket not connected');
        }
    }

    isConnected() {
        return this.connected;
    }
}

export const socketService = new SocketService();
