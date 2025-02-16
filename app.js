import maps from "./assets/js/maps.js";
import { loadStopData, toggleStops } from "./assets/js/stop.js";
import error from "./assets/js/error.js";
import { loadBusData, updateBusTimestamps } from "./assets/js/bus.js";

const { map } = maps();
loadStopData(map);

async function scrapeContent() {
  try {
    const response = await fetch("/scrape");
    if (!response.ok) {
      throw new Error("Erreur lors du scraping.");
    }
  } catch (error) {
    error("Erreur lors de la récupération des données");
  }

  try {
    const response = await fetch("/scrapeDelays");
    if (!response.ok) {
      throw new Error("Erreur lors du scraping.");
    }
  } catch (error) {
    error("Erreur lors de la récupération des données");
  }
}

window.addEventListener("load", async () => {
  await loadStopData();
  await loadBusData();
});
setInterval(updateBusTimestamps, 1000);

document.getElementById("refresh_btn").addEventListener("click", async () => {
  await scrapeContent();
  await loadBusData();
});

document.getElementById("stopbus_btn").addEventListener("click", () => {
  toggleStops(map);
});
