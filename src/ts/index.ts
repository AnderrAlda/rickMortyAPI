// interfaces/episode.ts

import { EpisodeResult } from "./interfaces/episodeResult";
import { Character } from "./interfaces/character";
import { Location } from "./interfaces/location";
import { Episode } from "./interfaces/episode";
import { EpisodeInfo } from "./interfaces/episodeInfo";

const urlAPI = "https://rickandmortyapi.com/api/episode";

let currentPage = 1;
let isLoading = false;

async function fetchEpisodesInfo(url: string): Promise<EpisodeInfo> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: Episode = await response.json();
    return data.info;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

async function fetchEpisodes(url: string): Promise<EpisodeResult[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: Episode = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

function renderEpisodes(episodes: EpisodeResult[]) {
  const episodeList = document.getElementById("episodeList")!;

  episodes.forEach((episode) => {
    const listItem = document.createElement("li");
    listItem.textContent = episode.name;

    // Attach click event listener to each episode list item
    listItem.addEventListener("click", () => {
      displayEpisodeInfo(episode);
    });

    episodeList.appendChild(listItem);
  });

  isLoading = false;
}

async function displayEpisodeInfo(selectedEpisode: EpisodeResult) {
  const mainContent = document.querySelector(".flex-1")!;
  mainContent.innerHTML = `
    <h1 class="text-3xl font-bold mb-4">${selectedEpisode.name}</h1>
    <p>Air Date: ${selectedEpisode.air_date}</p>
    <p>Episode Code: ${selectedEpisode.episode}</p>
    <h2 class="text-2xl font-bold mt-4">Characters:</h2>
    <div id="characterList" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"></div>
  `;

  const characterListContainer = document.getElementById("characterList")!;

  // Iterate through character URLs and fetch additional information
  for (const characterUrl of selectedEpisode.characters) {
    if (typeof characterUrl === "string") {
      await fetchAndRenderCharacter(characterUrl, characterListContainer);
    } else {
      console.error("Invalid character URL:", characterUrl);
    }
  }
}

function clearMainContent(callback?: () => void) {
  const mainContent = document.querySelector(".flex-1")!;
  mainContent.innerHTML = ""; // Clear the main content

  // Call the callback function if provided
  if (callback) {
    callback();
  }
}

async function fetchAndRenderCharacter(
  characterUrl: string,
  characterListContainer: HTMLElement
) {
  try {
    const response = await fetch(characterUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const characterData: Character = await response.json();

    // Create a div for each character
    const characterContainer = document.createElement("div");
    characterContainer.classList.add(
      "inset-0",
      "bg-gray-300",
      "rounded-md",
      "border",
      "border-gray-400",
      "p-4"
    );

    characterContainer.innerHTML = `
      <p>Name: ${characterData.name}</p>
      <p>Status: ${characterData.status}</p>
      <p>Species: ${characterData.species}</p>
      <img src="${characterData.image}" alt="${characterData.name}" class="mt-2">
    `;

    characterContainer.addEventListener("click", () => {
      clearMainContent(() => {
        displayCharacterInfo(characterData);
      });
    });

    characterListContainer.appendChild(characterContainer);

    // Fetch and render location information for each character
    // await fetchAndRenderLocation(characterData.location.url, characterContainer);
  } catch (error) {
    console.error("Error fetching character data:", error);
  }
}

async function fetchAndRenderEpisodes(episodeUrls: string[]) {
  const episodesContainer = document.createElement("div");
  episodesContainer.classList.add(
    "grid",
    "gap-4",
    "sm:grid-cols-2",
    "md:grid-cols-3",
    "lg:grid-cols-4",
    "xl:grid-cols-5"
  );

  for (const episodeUrl of episodeUrls) {
    try {
      const episodeResponse = await fetch(episodeUrl);

      if (!episodeResponse.ok) {
        throw new Error(`HTTP error! Status: ${episodeResponse.status}`);
      }

      const episodeData = await episodeResponse.json();

      const episodeInfoContainer = document.createElement("div");

      episodeInfoContainer.classList.add(
        "inset-0",
        "bg-gray-300",
        "rounded-md",
        "border",
        "border-gray-400",
        "p-4"
      );
      episodeInfoContainer.innerHTML = `
        <p>Name: ${episodeData.name}</p>
        <p>Air Date: ${episodeData.air_date}</p>
        <p>Episode Code: ${episodeData.episode}</p>
      `;

      // Attach click event listener to each episode container
      episodeInfoContainer.addEventListener("click", () => {
        clearMainContent(() => {
          displayEpisodeInfo(episodeData);
        });
      });

      episodesContainer.appendChild(episodeInfoContainer);
    } catch (error) {
      console.error("Error fetching episode data:", error);
    }
  }

  return episodesContainer;
}

async function displayCharacterInfo(characterData: Character) {
  const mainContent = document.querySelector(".flex-1")!;

  mainContent.innerHTML = `
<div class="flex flex-col lg:flex-row bg-gray-100 p-4 rounded-md shadow-md">
  <div class="w-full lg:w-1/4 mb-4 lg:mb-0">
    <img src="${characterData.image}" alt="${characterData.name}" class="mt-2 w-full rounded-md">
  </div>
  <div class="w-full lg:w-3/4 lg:pl-4">
    <p class="text-xl font-semibold mb-2">Name: ${characterData.name}</p>
    <p class="mb-2"><span class="text-gray-700">Status:</span> ${characterData.status}</p>
    <p class="mb-2"><span class="text-gray-700">Species:</span> ${characterData.species}</p>
    <p class="mb-2"><span class="text-gray-700">Gender:</span> ${characterData.gender}</p>
    <p class="mb-2"><span class="text-gray-700">Origin:</span> ${characterData.origin.name}</p>
    <div class="characterLocationInfo" id="locationInfoContainer">
    <p class="mb-2">
  <span class="text-gray-700">Location:</span>
  <span class="locationName cursor-pointer underline text-blue-500 hover:text-blue-700">${characterData.location.name}</span>
</p>

    </div>
  </div>
</div>

<h2 class="text-2xl font-bold mt-6">Episodes:</h2>

    <div id="episodeInfoList"></div>
  `;

  const episodeInfoListContainer = document.getElementById("episodeInfoList")!;
  const locationName = document.querySelector(".locationName");

  console.log("characterData.location:", characterData.location);
  // Add click event listener to location name
  locationName?.addEventListener("click", () => {
    clearMainContent(() => {
      displayLocationInfo(characterData.location as Location);
    });
  });

  // Fetch and render episode information
  const episodesContainer = await fetchAndRenderEpisodes(characterData.episode);
  episodeInfoListContainer.appendChild(episodesContainer);
}

async function displayLocationInfo(location: Location) {
  try {
    // Fetch location information
    const locationResponse = await fetch(location.url);

    if (!locationResponse.ok) {
      throw new Error(`HTTP error! Status: ${locationResponse.status}`);
    }

    const locationData: Location = await locationResponse.json();

    const mainContent = document.querySelector(".flex-1")!;
    mainContent.innerHTML = `
    <div class="mb-4 bg-gray-100 p-4 rounded-md shadow-md">
    <h1 class="text-3xl font-bold mb-4">Location Information</h1>
    <p class="text-xl font-semibold mb-2">Location Name: ${locationData.name}</p>
    <p class="mb-2"><span class="text-gray-700">Type:</span> ${locationData.type}</p>
    <p class="mb-2"><span class="text-gray-700">Dimension:</span> ${locationData.dimension}</p>
    </div>  
      <h2 class="text-2xl font-bold mt-4">Residents:</h2>
      <div id="residentsList" class = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"></div>
    `;

    const residentsListContainer = document.getElementById("residentsList")!;

    // Fetch and render characters for each resident
    for (const characterUrl of locationData.residents) {
      if (typeof characterUrl === "string") {
        await fetchAndRenderCharacter(characterUrl, residentsListContainer);
      } else {
        console.error("Invalid character URL:", characterUrl);
      }
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
  }
}

async function loadMoreEpisodes() {
  const info = await fetchEpisodesInfo(urlAPI);
  const maxPages = info.pages;

  const loadMoreButton = document.getElementById("loadMore")!;
  const sidebar = document.querySelector(".w-64")!;

  if (isLoading || currentPage >= maxPages) {
    loadMoreButton.remove();
    return;
  }

  isLoading = true;
  currentPage++;

  const nextPageUrl = `${urlAPI}?page=${currentPage}`;
  const episodes = await fetchEpisodes(nextPageUrl);

  renderEpisodes(episodes);
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const episodes = await fetchEpisodes(urlAPI);
    renderEpisodes(episodes);

    const loadMoreButton = document.getElementById("loadMore")!;

    // Check if the limit is reached before attaching the event listener
    if (!isLoading) {
      loadMoreButton.addEventListener("click", loadMoreEpisodes);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isLoading = false;
  }
});
