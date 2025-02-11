import { WebSocketServer, WebSocket } from 'ws';  
import { trackingDataMap } from '../data/mapData';

export default defineNitroPlugin((nitroApp) => {
  const wss = new WebSocketServer({  
    port: 3001,  
  });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');  

    ws.on('message', (message) => {  
      const trackingData = trackingDataMap[message.toString()];  

      // Example: Simulate sending location updates every 30 seconds
      if (trackingData) {
        const currLocation = trackingData.location;

        // Find the index of the current location in the route history
        let index = trackingData.routeHistory.findIndex((point) => {
          return point[0] === currLocation.lng && point[1] === currLocation.lat;
        });

        // If the current location is not in the route history, add it
        if (index === -1) {
          trackingData.routeHistory.push([currLocation.lng, currLocation.lat]);
          index = trackingData.routeHistory.length - 1;
        }

        const intervalId = setInterval(() => {  
          if (index >= trackingData.routeHistory.length) {  
            clearInterval(intervalId);
            return; 
          }  

          const updatedLocation = {
            ...trackingData,
            location: {
              lat: trackingData.routeHistory[index][1],
              lng: trackingData.routeHistory[index][0],
            },
          };

          ws.send(JSON.stringify(updatedLocation));  
          index++;  
        }, 30000);
      }
    });  

    ws.on('close', () => {  
      console.log('Client disconnected from WebSocket');  
    });  

    ws.on('error', (error) => {  
      console.error('WebSocket error:', error);  
    });  
  });  

  nitroApp.hooks.hook('close', () => {  
    wss.close();  
    console.log('WebSocket server closed');  
  });  

  console.log('WebSocket server started');  
});