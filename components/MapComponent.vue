<template>  
    <div ref="mapContainer" style="width: 100%; height: 100%;" />
</template>  
  
<script setup lang="ts">  
  import { ref, onMounted, watch } from 'vue';
  import mapboxgl from 'mapbox-gl'; 
  import type { TrackingData } from '../types/tracking';  
  
  const props = defineProps<{  
    trackingData: TrackingData | null;  
  }>();
  
  const mapContainer = ref<HTMLElement | null>(null);  
  const map = ref<mapboxgl.Map | null>(null);  
  const marker = ref<mapboxgl.Marker | null>(null);

  const createRouteHistoryGeoJSON = (history: TrackingData['routeHistory']): GeoJSON.Feature<GeoJSON.LineString> => {  
        return {  
            type: 'Feature',  
            properties: {},  
            geometry: {  
                type: 'LineString',  
                coordinates: history  
            }  
        };
    }; 

    const createRoutePointsGeoJSON = (history: TrackingData['routeHistory']): GeoJSON.FeatureCollection<GeoJSON.Point> => {  
        const features: GeoJSON.Feature<GeoJSON.Point>[] = history.map(coord => ({  
            type: 'Feature',  
            properties: {},  
            geometry: {  
                type: 'Point',  
                coordinates: coord  
            }  
        }));  

        return {  
            type: 'FeatureCollection',  
            features: features  
        };  
    };
  
  onMounted(() => {
    // TODO: use environment variables for the token
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGFubnlwbHVzMjIyIiwiYSI6ImNtNnc2cW8yOTBieG8yaXFxN3piampwN2EifQ.KOCl7C0R6jsSmk2XgKU1tA';
  
    map.value = new mapboxgl.Map({  
      container: mapContainer.value as HTMLElement,
      style: 'mapbox://styles/mapbox/streets-v12',  
      center: [20, 0], // Initial map center  
      zoom: 3,
    });

    // @ts-ignore 
    map.value!.on('load', () => {  
        // Add the route history source  
        map.value!.addSource('route-history', {  
            type: 'geojson',  
            data: createRouteHistoryGeoJSON([]) // Empty history to start
        });  

        // Add the route history line layer  
        map.value!.addLayer({  
            id: 'route-history-line',  
            type: 'line',  
            source: 'route-history',  
            layout: {  
                'line-join': 'round',  
                'line-cap': 'round'  
            },  
            paint: {  
                'line-color': '#5932EA',  
                'line-width': 10,  
                'line-opacity': 0.75  
            }  
        });  

        // Add Point Source and Layer
        map.value!.addSource('route-points', {  
            type: 'geojson',  
            data: createRoutePointsGeoJSON([])
        });  

        map.value!.addLayer({
            id: 'route-points-layer',  
            type: 'circle',  
            source: 'route-points',  
            paint: {  
                'circle-radius': 5,  
                'circle-color': '#ffffff' 
            }  
        });
    });

    map.value.on('click', 'route-points-layer', (e) => {  
        // e.features is an array of features that were clicked  
        if (e.features && e.features.length > 0) {  
            const clickedPoint = e.features[0];  

            // Check if the geometry exists and is of type Point  
            if (clickedPoint.geometry && clickedPoint.geometry.type === 'Point') {  
                const coordinates = (clickedPoint.geometry as GeoJSON.Point).coordinates;  

                // Fly to the clicked point with a specific zoom level  
                map.value!.flyTo({  
                    center: [coordinates[0], coordinates[1]],  
                    zoom: 14, 
                    duration: 2000  
                });  
            }  
        }  
    }); 
  
    if (props.trackingData) {  
      updateMap(props.trackingData);  
    }  
  });  
  
  watch(  
    () => props.trackingData,  
    (newTrackingData) => {  
      if (newTrackingData) {  
        updateMap(newTrackingData);  
      }  
    }  
  );
  
    // Animation Function  
    const animateMarker = (newLngLat: [number, number], duration: number) => {  
        const start = marker.value!.getLngLat(); // Starting coordinates  
        const startTime = performance.now();  

        function frame(time: number) {  
            const animationProgress = (time - startTime) / duration;  

            if (animationProgress < 1) {  
                const newLng = start.lng + (newLngLat[0] - start.lng) * animationProgress;  
                const newLat = start.lat + (newLngLat[1] - start.lat) * animationProgress;  
                marker.value!.setLngLat([newLng, newLat]);  

                requestAnimationFrame(frame);
            } else {  
                // Animation complete  
                marker.value!.setLngLat(newLngLat); // Ensure final position is exact  
            }  
        }  

        requestAnimationFrame(frame);
    }; 
  
  const updateMap = (trackingData: TrackingData) => {  
    if (map.value) {
        // Update the route history data  
        (map.value.getSource('route-history') as mapboxgl.GeoJSONSource).setData(createRouteHistoryGeoJSON(trackingData.routeHistory));

        (map.value.getSource('route-points') as mapboxgl.GeoJSONSource).setData(createRoutePointsGeoJSON(trackingData.routeHistory));

        // Fly to the location
        // only if 
        map.value.flyTo({  
            center: [trackingData.location.lng, trackingData.location.lat],  
            essential: true,  
            zoom: 12,
        });
    
        if (marker.value) {
            // Animate the marker to the new location  
            animateMarker([trackingData.location.lng, trackingData.location.lat], 1000);

            // Update the marker position
            marker.value!.setLngLat([trackingData.location.lng, trackingData.location.lat]);
            return;
        }

        // Create a marker and add it to the map. 
        marker.value = new mapboxgl.Marker()
            .setLngLat([trackingData.location.lng, trackingData.location.lat])
            // @ts-ignore
            .addTo(map.value!);
    }  
  };

    // Cleanup
    onBeforeUnmount(() => {  
        if (map.value) {  
            map.value.remove();  
        }  
    });
</script>
