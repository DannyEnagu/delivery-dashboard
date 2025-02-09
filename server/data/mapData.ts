import { TrackingData } from "~/types/tracking";
import { route1 } from "./routes/route1";
import { route2 } from "./routes/route2";


// Mock data (replace with database access in a real app)  
export const trackingDataMap: { [key: string]: TrackingData } = {  
    '12345': {  
      trackingNumber: '12345',  
      status: 'In transit',  
      location: { lat: 6.49472380390641, lng: 3.371680508531 }, 
      routeHistory: route1, 
    },  
    '67890': {
      trackingNumber: '67890',
      status: 'Delivered',  
      location: { lat: 6.464649301551134, lng: 3.386508663582788 },
      routeHistory: route2,  
    },  
  };