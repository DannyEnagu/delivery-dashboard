export interface Location {  
    lat: number;  
    lng: number;  
}  

export interface TrackingData {  
    trackingNumber: string;  
    status: string;  
    location: Location;  
    routeHistory: number[][];  
} 