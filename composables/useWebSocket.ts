import { ref, onMounted, onUnmounted } from 'vue';  

export function useWebSocket(url: string) {  
  const data = ref<any>(null);  
  const ws = ref<WebSocket | null>(null);  
  const isConnected = ref<boolean>(false);  
  const error = ref<Event | null>(null);  

  onMounted(() => {  
    connect();  
  });  

  onUnmounted(() => {  
    disconnect();  
  });  


  const connect = () => {  
    ws.value = new WebSocket(url);  

    ws.value.onopen = () => {  
      console.log('WebSocket connected');  
      isConnected.value = true;  
    };  

    ws.value.onmessage = (event) => {  
      try {  
        data.value = JSON.parse(event.data);  
      } catch (e) {  
        console.warn('Failed to parse WebSocket message', e);  
        data.value = event.data; // Fallback to raw data  
      }  
    };  

    ws.value.onclose = () => {  
      console.log('WebSocket disconnected');  
      isConnected.value = false;  
    };  

    ws.value.onerror = (event) => {  
      console.error('WebSocket error:', event);  
      error.value = event;  
      isConnected.value = false;  
    };  
  };  

  const disconnect = () => {  
    if (ws.value) {  
      ws.value.close();  
      isConnected.value = false;  
    }  
  };  

  const send = (message: string) => {  
    if (ws.value && isConnected.value) {  
      ws.value.send(message);  
    } else {  
      console.warn('WebSocket not connected.  Message not sent.');  
    }  
  };  


  return {
    data,
    isConnected,
    error,
    connect,
    disconnect,
    send
  };  
}