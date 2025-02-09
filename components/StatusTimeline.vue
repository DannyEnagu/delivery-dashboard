<template>  
    <div>  
        <h3 class="mt-5 mb-3">Ongoing Delivery</h3>
        <div v-if="timelineEvents.length" class="bg-white p-3 border-round-2xl shadow-3">
            <div class="flex align-items-center justify-content-between">
                <div>
                    <small class="text-500">Tracking Number</small>
                    <h4>{{ `EV-${props.trackingData?.trackingNumber}` }}</h4>
                </div>
                <img
                    src="~/assets/img/delivery-truck.png"
                    alt="delivery truck"
                    class="w-100"
                />
            </div>
            <Divider class="my-4 divider" />
            <Timeline :value="timelineEvents">
                <template #marker="slotProps">
                    <span class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1" :style="{ backgroundColor: slotProps.item.color }">
                        <i :class="slotProps.item.icon"></i>
                    </span>
                </template>
                <template #opposite="slotProps">
                    <small class="text-500">
                        {{ new Date(slotProps.item.timeStamp).toLocaleString() }}
                    </small>
                </template>
                <template #content="slotProps">
                    <strong class="text-heading">{{ slotProps.item.status }}</strong>
                </template>
            </Timeline>
        </div>
        <p v-else class="text-center text-500">
            No tracking data available
        </p>
    </div>  
</template>  
  
<script setup lang="ts">  
    import { computed, watch } from 'vue';  
    import type { TrackingData } from '../types/tracking'; 
    import Timeline from 'primevue/timeline';
    import Divider from 'primevue/divider';

    const props = defineProps<{  
        trackingData: TrackingData | null;  
    }>();  

    const timelineEvents = computed(() => {  
        if (!props.trackingData) {  
            return [];  
        }

        const events = [
            // Subtract 2 hours for each status change
            { status: 'Ordered', timeStamp: new Date().getTime() - 7200000, icon: 'pi pi-shopping-cart', color: '#9C27B0'},
            { status: 'Processing', timeStamp: new Date().getTime() - 14400000, icon: 'pi pi-cog', color: '#673AB7' },
            { status: 'Shipped', timeStamp: new Date().getTime() - 21600000, icon: 'pi pi-shopping-cart', color: '#FF9800' },
        ];

        return events;  
    });

    watch(() => props.trackingData, (newTrackingDate) => {
        if (newTrackingDate) {
            // Add in-transit status
            if (timelineEvents.value.length === 3) {
                timelineEvents.value.push({ status: 'In Transit', timeStamp: new Date().getTime(), icon: 'pi pi-truck', color: '#FF5722' });
            }

            // Add delivered status
            // if location is the final destination
            const destination = newTrackingDate.routeHistory[newTrackingDate.routeHistory.length - 1];
            const location = newTrackingDate.location;

            if (location.lat === destination[1] && location.lng === destination[0]) {
                timelineEvents.value.push({ status: 'Delivered', timeStamp: new Date().getTime(), icon: 'pi pi-check', color: '#4CAF50' });
            }
        }
    });
</script>

<style scoped>
    .divider::before {
        border-color: #ECECEC !important;
    }
</style>