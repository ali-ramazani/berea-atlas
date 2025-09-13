// src/components/Map/Map.jsx
import  { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import PropTypes from 'prop-types';
import {INITIAL_COORDINATES} from "../../constants/constants.js";

const Map = ({ selectedOffice }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const initialCoordinates = [INITIAL_COORDINATES.lng, INITIAL_COORDINATES.lat];
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    mapboxgl.accessToken = apiKey;

    // Initialize the map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: initialCoordinates,
      zoom: 17,
      pitch: 60, // 3D perspective
      bearing: -17.6,
      antialias: true, // Smoother edges for 3D rendering
    });
    mapRef.current = map;

    // Add 3D buildings layer on map load
    map.on('load', () => {
      // Terrain source for realistic 3D elevation
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.2 });

      // Add 3D buildings layer
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
      )?.id;

      map.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa', // Building color
            'fill-extrusion-height': ['get', 'height'], // Building height
            'fill-extrusion-base': ['get', 'min_height'], // Base height
            'fill-extrusion-opacity': 0.6, // Semi-transparent for depth
          },
        },
        labelLayerId
      );

      // Add sky layer
      map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15,
        },
      });
    });

    // Cleanup function to remove the map instance
    return () => {
      map.remove();
    };
  }, [apiKey]);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;

       if (selectedOffice?.building_latitude && selectedOffice?.building_longitude) {
        const lng = parseFloat(selectedOffice.building_longitude);
        const lat = parseFloat(selectedOffice.building_latitude);
        if (Number.isFinite(lng) && Number.isFinite(lat)) {
          map.flyTo({
            center: [lng, lat],
            zoom: 19.5,
            speed: 1.3,
            curve: 1.2,
            easing: (t) => t,
          });
        } else {
          console.error("Invalid lat/lng on selectedOffice", selectedOffice);
        }
      } else {
        map.flyTo({
          center: initialCoordinates,
          zoom: 17,
          pitch: 60, // for 3D
          bearing: -17.6,
          speed: 1.3,
          curve: 1.2,
          easing: (t) => t,
        });
      }
    }
  }, [selectedOffice]);

  return <div ref={mapContainerRef} className="map-container"></div>;
};

Map.propTypes = {
  selectedOffice: PropTypes.object,
};

export default Map;
