// src/components/Map.js
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import professorsData from '../../offices.json';

// Access the Mapbox API key from environment variables
const apiKey = import.meta.env.VITE_API_KEY;

const Map = ({ selectedProfessor }) => {
  const mapRef = useRef(null); // Reference to the Mapbox map instance
  const mapContainerRef = useRef(null); // Reference to the map container DOM element

  // Initial Coordinates for Boone Tavern
  const initialCoordinates = [-84.2888889, 37.5733333]; // [Longitude, Latitude]

  useEffect(() => {
    // **Initialize Mapbox Map**
    mapboxgl.accessToken = apiKey;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // Container ID
      style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
      center: initialCoordinates, // Starting position [lng, lat]
      zoom: 17, // Starting zoom level
      pitch: 45, // Tilt the map for a 3D effect
      bearing: -17.6, // Rotate the map for better orientation
      antialias: true, // Enable antialiasing for smoother edges
    });

    map.on('load', () => {
      // Add Terrain (Optional)
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.2 });

      // **Add Sky Layer (Optional)**
      map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15,
        },
      });

      // Identify the Label Layer to Insert 3D Buildings Below It
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
      )?.id;

      // Add 3D Buildings Layer with Increased Heights and Smoother Edges
      map.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            // Color of the Buildings
            'fill-extrusion-color': '#aaaaaa',

            // Increase Building Heights by a Multiplier
            'fill-extrusion-height': ['*', ['get', 'height'], 1.1], // Original height * 1.1

            // Adjust the Base of the Buildings Accordingly
            'fill-extrusion-base': ['*', ['get', 'min_height'], 1.1], // Original min_height * 1.1

            // Opacity for Visual Depth
            'fill-extrusion-opacity': 0.6,

            // Optional: Smoother Edges by Slightly Adjusting Color and Opacity
            // You can experiment with these values for desired smoothness
            // 'fill-extrusion-color': '#cccccc',
            // 'fill-extrusion-opacity': 0.8,
          },
        },
        labelLayerId // Insert below the label layer for proper layering
      );

      // **Optional: Add Any Other Layers or Sources Here**

      // **Optional: Remove Existing Markers if Any (Cleanup)**
      // If you previously had global markers, ensure they are removed here.
    });

    mapRef.current = map; // Store the map instance reference

    return () => {
      // Clean up on unmount
      map.remove();
    };
  }, []);

  // **Handle Map View Transitions Based on Selected Professor**
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;

      if (selectedProfessor) {
        const { coordinates, name, department, office } = selectedProfessor;

        // **Validate Coordinates**
        if (!coordinates || coordinates.length !== 2) {
          console.error('Invalid coordinates for selected professor.');
          return;
        }

        // Fly to the Professor's Office Coordinates Smoothly
        map.flyTo({
          center: coordinates,
          zoom: 20, // Higher zoom for closer view
          speed: 1.3, // Make the flying slow enough to be smooth
          curve: 1.2, // Make the flying curve smooth
          easing: (t) => t, // Linear easing for consistent speed
        });
      } else {
        // No Professor Selected: Reset Map to Boone Tavern
        map.flyTo({
          center: initialCoordinates,
          zoom: 17,
          pitch: 45,
          bearing: -17.6,
          speed: 1.3,
          curve: 1.2,
          easing: (t) => t,
        });
      }
    }
  }, [selectedProfessor]);

  return (
    <div
      ref={mapContainerRef}
      className="map-container"
      style={{ width: '100%', height: '100vh' }} // Adjust height as needed
    ></div>
  );
};

export default Map;
