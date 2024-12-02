import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "../App.css";

const apiKey = import.meta.env.VITE_API_KEY;

const Map = () => {
  const mapRef = useRef();
  const mapContainerRef = useRef();


  useEffect(() => {
    mapboxgl.accessToken =
      apiKey;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11", // Dark style for the map
      center: [-84.2953, 37.5689], // Coordinates for Berea College Bone Tavern
      zoom: 18.5,
      pitch: 45,
      bearing: -17.6,
      antialias: true, // Enables smoother edges
    });

    map.on("style.load", () => {
      // Insert the 3D buildings layer beneath any symbol layer
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === "symbol" && layer.layout["text-field"]
      )?.id;

      // Add 3D buildings layer with improved aesthetics
      map.addLayer(
        {
          id: "add-3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#1a1a1a", // Dark gray for buildings
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["*", ["get", "height"], 2], // 2 is multiplier for taller buildings
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["*", ["get", "min_height"], 2], // Multiply min_height by 2
            ],
            "fill-extrusion-opacity": 0.9, // Higher opacity for clarity
            "fill-extrusion-ambient-occlusion": true, // Enable ambient lighting
          },
        },
        labelLayerId
      );

      // Customize text visibility
      if (labelLayerId) {
        map.setLayoutProperty(labelLayerId, "text-color", "#ffffff"); // Set text color to white
        map.setLayoutProperty(labelLayerId, "text-halo-color", "#000000"); // Add a black halo for contrast
        map.setLayoutProperty(labelLayerId, "text-halo-width", 2); // Adjust halo width
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map-container" ref={mapContainerRef} style={{ height: "100vh" }}></div>;
};

export default Map;
