let mapInstance = null;

export default function maps() {
  if (!mapInstance) {
    mapInstance = L.map("map").setView([49.884287, 2.309166], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(
      mapInstance
    );
  }

  let stopsLayer = null;
  let busMarkersLayer = L.layerGroup().addTo(mapInstance);

  return { map: mapInstance, stopsLayer, busMarkersLayer };
}
