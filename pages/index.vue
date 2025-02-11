<template>  
    <div class="flex h-screen pt-2rem">
      <div class="w-25rem pt-5 px-3 border-right border-200">
        <TrackingInput
          :is-error="isTrackingNumberValid"
          @submit="handleTrackingSubmit"
        />  
        <StatusTimeline :tracking-data="trackingData" />  
      </div>
      <div class="flex-1">
        <MapComponent :tracking-data="trackingData" />  
      </div>
      <Toast />
    </div>
  </template>  
  
  <script setup lang="ts"> 
  import { ref, watch } from 'vue';
  import TrackingInput from '../components/TrackingInput.vue';  
  import MapComponent from '../components/MapComponent.vue';  
  import StatusTimeline from '../components/StatusTimeline.vue';  
  import type { TrackingData, Location } from '../types/tracking';
  import { useWebSocket } from '../composables/useWebSocket';
  import Toast from 'primevue/toast';
  import { useToast } from 'primevue/usetoast';

  const toast = useToast();
  const trackingNumber = ref('');  
  const trackingData = ref<TrackingData | null>(null)
  
  // Validate tracking number
  const isTrackingNumberValid = computed(() => trackingData.value === null && trackingNumber.value.length > 0);

  // WebSocket setup  
  const websocketURL = 'ws://localhost:3001';
  const { data: wsData, isConnected, error, send } = useWebSocket(websocketURL);  
  
  const handleTrackingSubmit = async (number: string) => {  
    trackingNumber.value = number;  
    await fetchInitialData();  
    if (trackingNumber.value) {  
      send(trackingNumber.value); // Send tracking number to WebSocket server  
    }  
  };  
  
  
  // Fetch initial tracking data from the server API  
  const fetchInitialData = async () => {  
    if (!trackingNumber.value) return;  
  
    const { data, error } = await useFetch<TrackingData>(`/api/tracking/${trackingNumber.value}`);  
  
    if (error.value) {  
      console.error('Error fetching tracking data:', error.value);  
      trackingData.value = null;
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: `Invalid tracking number: ${trackingNumber.value}`,
        life: 5000,
      });
      return;  
    }  
  
    trackingData.value = data.value;  
  };  
  
  
  // Update tracking data from WebSocket messages  
  watch(wsData, (newWsData) => {
    if (newWsData && newWsData.trackingNumber === trackingNumber.value) {  
      // Update location.
      // Important:  Handle potential missing fields gracefully.  
      trackingData.value = {  
        ...trackingData.value!, 
        location: {
          lat: newWsData.location?.lat ?? trackingData.value!.location.lat, // Use current if new is missing  
          lng: newWsData.location?.lng ?? trackingData.value!.location.lng,  
        } as Location,  
      };  
    }  
  });
</script>