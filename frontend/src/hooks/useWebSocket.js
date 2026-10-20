import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';

export function useWebSocket(url, topic) {
  const [data, setData] = useState([]);
  const client = useRef(null);

  useEffect(() => {
    client.current = new Client({
      brokerURL: url,
      onConnect: () => {
        client.current.subscribe(topic, (message) => {
          if (message.body) {
            setData(JSON.parse(message.body));
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      // for sockjs fallback you can use webSocketFactory if needed, 
      // but spring w/o sockjs works with ws://
    });
    
    // Connect to websocket
    client.current.activate();

    return () => {
      if (client.current) {
        client.current.deactivate();
      }
    };
  }, [url, topic]);

  const fetchInitialData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/tasks');
      const initialData = await response.json();
      setData(initialData);
    } catch (error) {
      console.error('Error fetching initial tasks:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  return { data, client: client.current, refetch: fetchInitialData };
}
