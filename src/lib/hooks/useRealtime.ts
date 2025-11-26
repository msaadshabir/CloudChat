'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface NewTweetEvent {
  type: 'new-tweets';
  count: number;
  tweets: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string | null;
      image: string | null;
      username: string | null;
    };
  }>;
}

interface HeartbeatEvent {
  type: 'heartbeat';
}

interface ConnectedEvent {
  type: 'connected';
  connectionId: string;
}

type SSEEvent = NewTweetEvent | HeartbeatEvent | ConnectedEvent;

interface UseRealtimeOptions {
  onNewTweets?: (count: number) => void;
  enabled?: boolean;
}

export function useRealtime({ onNewTweets, enabled = true }: UseRealtimeOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [newTweetsCount, setNewTweetsCount] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!enabled) return;
    
    // Clean up existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const eventSource = new EventSource('/api/stream');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as SSEEvent;
          
          if (data.type === 'new-tweets') {
            setNewTweetsCount(prev => prev + data.count);
            onNewTweets?.(data.count);
          } else if (data.type === 'connected') {
            setIsConnected(true);
          }
          // Heartbeat events are just for keeping connection alive
        } catch (error) {
          console.error('Failed to parse SSE message:', error);
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        eventSource.close();
        
        // Attempt to reconnect after 5 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      };
    } catch (error) {
      console.error('Failed to create EventSource:', error);
      setIsConnected(false);
    }
  }, [enabled, onNewTweets]);

  const clearNewTweetsCount = useCallback(() => {
    setNewTweetsCount(0);
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return {
    isConnected,
    newTweetsCount,
    clearNewTweetsCount
  };
}
