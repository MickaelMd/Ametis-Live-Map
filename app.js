import maps from "./assets/js/maps.js";
import { loadStopData, toggleStops } from "./assets/js/stop.js";
import error from "./assets/js/error.js";
import { loadBusData, updateBusTimestamps } from "./assets/js/bus.js";

const getBaseURL = () => {
  const path = window.location.pathname;
  const match = path.match(/^\/([a-zA-Z0-9_-]+)(\/|$)/);
  return match ? `/${match[1]}` : "";
};

const BASE_URL = getBaseURL();

const { map } = maps();
loadStopData(map);

async function scrapeContent() {
  try {
    const response = await fetch(`${BASE_URL}/scrape`);
    if (!response.ok) {
      throw new Error("Erreur lors du scraping des bus.");
    }
  } catch (err) {
    error("Impossible de récupérer les données des bus.");
  }

  try {
    const response = await fetch(`${BASE_URL}/scrapeDelays`);
    if (!response.ok) {
      throw new Error("Erreur lors du scraping des retards.");
    }
  } catch (err) {
    error("Impossible de récupérer les données de retard.");
  }
}

window.addEventListener("load", async () => {
  await loadStopData(map);
  await loadBusData();
});
setInterval(updateBusTimestamps, 1000);

document.getElementById("refresh_btn").addEventListener("click", async () => {
  await scrapeContent();
  await loadBusData();
});

document.addEventListener("keydown", async (event) => {
  if (event.code === "Space") {
    await scrapeContent();
    await loadBusData();
  }
});

document.getElementById("stopbus_btn").addEventListener("click", () => {
  toggleStops(map);
});
