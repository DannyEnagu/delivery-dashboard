import { defineEventHandler, H3Event } from 'h3';
import { trackingDataMap } from '~/server/data/mapData';


export default defineEventHandler((event: H3Event) => {  
  const trackingNumber = event.context.params?.trackingNumber;  

  if (!trackingNumber) {
    throw createError({ statusCode: 400, statusMessage: 'Tracking number is required' });  
  }  

  const data = trackingDataMap[trackingNumber as string];  

  if (!data) {  
    throw createError({ statusCode: 404, statusMessage: 'Tracking data not found' });  
  }  

  return data;
});