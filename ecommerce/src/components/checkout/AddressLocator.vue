<template>
  <div>
    <!-- Search Box for Place Autocomplete -->
    <input id="autocomplete" type="text" placeholder="Enter a location" class="search-box" />

    <!-- Google Map Component -->
    <GoogleMap :api-key="apiKey" style="width: 100%; height: 500px" :center="center" :zoom="zoom"
      @click="handleMapClick" :options="mapOptions">
      <!-- Marker Component -->
      <Marker v-if="markerPosition" :options="{ position: markerPosition }" />
    </GoogleMap>

  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import axios from 'axios';

// Emit events
const emit = defineEmits(['location-selected']);

const apiUrl = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

// Google Maps API Key
const apiKey = apiUrl; // Replace with your API key

// Map Center and Zoom Level
const center = ref({ lat: 16.8409, lng: 96.1735 }); // Center of Yangon
const zoom = ref(12); // Initial zoom level

// Marker Position, Coordinates, and Location Name
const markerPosition = ref(null); // Marker position
const coordinates = ref(null); // Selected coordinates
const locationName = ref(''); // Selected location name

// Define Yangon Bounds
const yangonBounds = {
  north: 17.1, // Northern boundary of Yangon
  south: 16.7, // Southern boundary of Yangon
  east: 96.3,  // Eastern boundary of Yangon
  west: 95.9,  // Western boundary of Yangon
};

// Map Options with Restriction
const mapOptions = ref({
  restriction: {
    latLngBounds: yangonBounds,
    strictBounds: true, // Prevent panning outside the bounds
  },
  minZoom: 10, // Minimum zoom level to keep the map focused on Yangon
});

// Fetch Location Name using Geocoding API
const fetchLocationName = async (lat, lng) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
    if (response.data.results.length > 0) {
      locationName.value = response.data.results[0].formatted_address;
    } else {
      locationName.value = 'Unknown location';
    }
  } catch (error) {
    console.error('Error fetching location name:', error);
    locationName.value = 'Error fetching location';
  }
};

// Handle Map Click Event
const handleMapClick = (event) => {
  // Extract latitude and longitude from the click event
  const lat = event.latLng.lat();
  const lng = event.latLng.lng();

  // Check if the clicked location is within Yangon bounds
  if (
    lat >= yangonBounds.south &&
    lat <= yangonBounds.north &&
    lng >= yangonBounds.west &&
    lng <= yangonBounds.east
  ) {
    // Update marker position and coordinates
    markerPosition.value = { lat, lng };
    coordinates.value = { lat, lng };

    // Fetch and update the location name
    fetchLocationName(lat, lng);

    // Emit the selected location data
    emit('location-selected', { coordinates: { lat, lng }, locationName: locationName.value });

    // Log the selected coordinates
    console.log('Selected Coordinates:', coordinates.value);
  } else {
    alert('Please select a location within Yangon.');
  }
};

// Initialize Google Places Autocomplete
const initAutocomplete = () => {
  const input = document.getElementById('autocomplete');
  if (!input) {
    console.error('Autocomplete input element not found');
    return;
  }

  if (!window.google || !window.google.maps || !window.google.maps.places) {
    console.error('Google Maps Places library not loaded');
    return;
  }

  const autocomplete = new google.maps.places.Autocomplete(input, {
    bounds: new google.maps.LatLngBounds(
      new google.maps.LatLng(yangonBounds.south, yangonBounds.west),
      new google.maps.LatLng(yangonBounds.north, yangonBounds.east)
    ),
    strictBounds: true,
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      // Update marker position and coordinates
      markerPosition.value = { lat, lng };
      coordinates.value = { lat, lng };
      center.value = { lat, lng };

      // Fetch and update the location name
      fetchLocationName(lat, lng);

      // Emit the selected location data
      emit('location-selected', { coordinates: { lat, lng }, locationName: locationName.value });

      // Log the selected coordinates
      console.log('Selected Coordinates:', coordinates.value);
    } else {
      console.error('Place geometry not found');
    }
  });
};

// Load Google Maps API and initialize Autocomplete
onMounted(() => {
  if (window.google && window.google.maps) {
    console.warn('Google Maps API already loaded');
    initAutocomplete();
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = () => {
    console.log('Google Maps API loaded');
    initAutocomplete();
  };
  script.onerror = () => {
    console.error('Failed to load Google Maps API');
  };
  document.head.appendChild(script);
});
</script>

<style scoped>
/* Add any custom styles here */
.search-box {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
}
</style>