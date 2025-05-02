import maps from "./maps.js";
import { stops } from "./stop.js";
import error from "./error.js";

let previousBusData = null;
let busMarkers = {};

const { busMarkersLayer } = maps();

function areBusDataEqual(newData, oldData) {
  return JSON.stringify(newData) === JSON.stringify(oldData);
}

export async function loadBusData() {
  try {
    const busResponse = await fetch("./assets/json/scrapedData.json");
    if (!busResponse.ok) {
      throw new Error(
        "Erreur de réseau lors du chargement des données des bus."
      );
    }
    const busData = await busResponse.json();

    const delayResponse = await fetch("./assets/json/scrapedDelays.json");
    if (!delayResponse.ok) {
      throw new Error(
        "Erreur de réseau lors du chargement des données des retards."
      );
    }
    const delayData = await delayResponse.json();

    if (previousBusData && areBusDataEqual(busData, previousBusData)) {
      error("Les données des bus sont à jour.");
      return;
    }
    if (typeof busData.content.entity.length != "undefined") {
      console.log(`Nombre total de bus : ${busData.content.entity.length}`);
      error(`Nombre total de bus : ${busData.content.entity.length}`);
    } else {
      error("Aucun bus en circulation");
    }

    busMarkersLayer.clearLayers();
    busMarkers = {};

    const statusTranslations = {
      IN_TRANSIT_TO: "En transit",
      STOPPED_AT: "Arrêté",
      INCOMING_AT: "En approche",
    };

    const delayMap = {};
    delayData.content.entity.forEach((delay) => {
      const tripId = delay.id;
      if (
        delay.trip_update &&
        Array.isArray(delay.trip_update.stop_time_update)
      ) {
        delay.trip_update.stop_time_update.forEach((update) => {
          if (update.arrival && update.arrival.delay) {
            delayMap[tripId] = update.arrival.delay;
          }
        });
      }
    });

    busData.content.entity.forEach((bus) => {
      if (bus.vehicle && bus.vehicle.position) {
        const { latitude, longitude, speed } = bus.vehicle.position;
        const currentStatus = bus.vehicle.current_status;
        const stopId = bus.vehicle.stop_id;
        const tripId = bus.vehicle.trip ? bus.vehicle.trip.trip_id : null;

        if (latitude && longitude) {
          let defaultIconUrl = "assets/img/bus_icon.png";
          let routeIconUrl =
            bus.vehicle.trip && bus.vehicle.trip.route_id
              ? `assets/img/${bus.vehicle.trip.route_id}.png`
              : defaultIconUrl;

          let icon = L.icon({
            iconUrl: routeIconUrl,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15],
          });

          let speedText =
            speed != null ? Math.floor(speed * 3.6) + " km/h" : "Inconnu";
          const statusText = statusTranslations[currentStatus] || "Inconnu";
          const stopName = stops[stopId] || "Inconnu";
          const currentTimestamp = Math.floor(Date.now() / 1000);
          const busTimestamp = parseInt(bus.vehicle.timestamp, 10);
          let timeDifference = currentTimestamp - busTimestamp;
          let minutes = Math.floor(timeDifference / 60);
          let seconds = timeDifference % 60;
          let delayText = `Dernière mise à jour : ${minutes} min ${seconds} sec`;
          const delay = delayMap[tripId];
          const estimatedDelayText =
            delay !== undefined
              ? `Retard estimé : ${delay} sec`
              : "Retard estimé : Non disponible";

          const busMarker = L.marker([latitude, longitude], { icon })
            .addTo(busMarkersLayer)
            .bindPopup(
              `<b>Bus ID:</b> ${bus.id}<br><b>Ligne:</b> ${
                bus.vehicle.trip ? bus.vehicle.trip.route_id : "Non attribué"
              }<br><b>Vitesse:</b> ${speedText}<br><b>Statut:</b> ${statusText}<br><b>Prochain arrêt:</b> ${stopName}<br><b>${delayText}</b><br><b>${estimatedDelayText}</b>`
            );

          busMarkers[bus.id] = {
            marker: busMarker,
            timestamp: busTimestamp,
          };

          const busIconImg = new Image();
          busIconImg.src = routeIconUrl;
          busIconImg.onerror = function () {
            icon = L.icon({
              iconUrl: defaultIconUrl,
              iconSize: [30, 30],
              iconAnchor: [15, 15],
              popupAnchor: [0, -15],
            });
            busMarker.setIcon(icon);
          };
        } else {
          console.warn(
            `Les données du bus ID ${bus.id} sont incomplètes. Latitude ou Longitude manquante.`
          );
        }
      } else {
        console.warn(
          `Les données du bus ID ${bus.id} sont incomplètes. Position ou véhicule manquant.`
        );
      }
    });

    previousBusData = busData;
  } catch (err) {
    error(
      "Impossible de charger les données des bus. Rendez-vous sur Ametis.fr."
    );
  }
}

export function updateBusTimestamps() {
  const currentTimestamp = Math.floor(Date.now() / 1000);

  Object.keys(busMarkers).forEach((busId) => {
    const busData = busMarkers[busId];
    const timeDifference = currentTimestamp - busData.timestamp;
    const minutes = Math.floor(timeDifference / 60);
    const seconds = timeDifference % 60;
    const delayText = `Dernière mise à jour : ${minutes} min ${seconds} sec`;
    const popupContent = busData.marker.getPopup().getContent();
    const updatedContent = popupContent.replace(
      /Dernière mise à jour :.*?(min.*?)<\/b>/,
      `<b>${delayText}</b>`
    );

    busData.marker.getPopup().setContent(updatedContent);
  });
}
