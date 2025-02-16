import error from "./error.js";
import maps from "./maps.js";

export let stops = {};

let stopsLayer;

export async function loadStopData(maps) {
  try {
    const response = await fetch("assets/json/stop.geoJson");
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des données des arrêts.");
    }
    const geoJsonData = await response.json();

    geoJsonData.features.forEach((feature) => {
      const stopId = feature.properties.id;
      const stopName = feature.properties.name;
      stops[stopId] = stopName;
    });

    stopsLayer = L.geoJSON(geoJsonData, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: "red",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.5,
        });
      },
      onEachFeature: (feature, layer) => {
        const stopName = feature.properties.name || "Inconnu";
        layer.bindPopup(`<b>Arrêt:</b> ${stopName}`);
      },
    });
  } catch (error) {
    error("Erreur de chargement des données des arrêts");
  }
}

export function toggleStops(map) {
  if (stopsLayer) {
    if (map.hasLayer(stopsLayer)) {
      map.removeLayer(stopsLayer);
    } else {
      map.addLayer(stopsLayer);
    }
  }
}
