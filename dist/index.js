var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const urlAPI = "https://rickandmortyapi.com/api/episode";
let currentPage = 1;
let isLoading = false;
function fetchEpisodesInfo(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            return data.info;
        }
        catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    });
}
function fetchEpisodes(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            return data.results;
        }
        catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    });
}
function renderEpisodes(episodes) {
    const episodeList = document.getElementById("episodeList");
    episodes.forEach((episode) => {
        const listItem = document.createElement("li");
        listItem.textContent = episode.name;
        listItem.addEventListener("click", () => {
            displayEpisodeInfo(episode);
        });
        episodeList.appendChild(listItem);
    });
    isLoading = false;
}
function displayEpisodeInfo(selectedEpisode) {
    return __awaiter(this, void 0, void 0, function* () {
        const mainContent = document.querySelector(".flex-1");
        mainContent.innerHTML = `
    <h1 class="text-3xl font-bold mb-4">${selectedEpisode.name}</h1>
    <p>Air Date: ${selectedEpisode.air_date}</p>
    <p>Episode Code: ${selectedEpisode.episode}</p>
    <h2 class="text-2xl font-bold mt-4">Characters:</h2>
    <div id="characterList" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"></div>
  `;
        const characterListContainer = document.getElementById("characterList");
        for (const characterUrl of selectedEpisode.characters) {
            if (typeof characterUrl === "string") {
                yield fetchAndRenderCharacter(characterUrl, characterListContainer);
            }
            else {
                console.error("Invalid character URL:", characterUrl);
            }
        }
    });
}
function clearMainContent(callback) {
    const mainContent = document.querySelector(".flex-1");
    mainContent.innerHTML = "";
    if (callback) {
        callback();
    }
}
function fetchAndRenderCharacter(characterUrl, characterListContainer) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(characterUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const characterData = yield response.json();
            const characterContainer = document.createElement("div");
            characterContainer.classList.add("inset-0", "bg-gray-300", "rounded-md", "border", "border-gray-400", "p-4");
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
        }
        catch (error) {
            console.error("Error fetching character data:", error);
        }
    });
}
function fetchAndRenderEpisodes(episodeUrls) {
    return __awaiter(this, void 0, void 0, function* () {
        const episodesContainer = document.createElement("div");
        episodesContainer.classList.add("grid", "gap-4", "sm:grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4", "xl:grid-cols-5");
        for (const episodeUrl of episodeUrls) {
            try {
                const episodeResponse = yield fetch(episodeUrl);
                if (!episodeResponse.ok) {
                    throw new Error(`HTTP error! Status: ${episodeResponse.status}`);
                }
                const episodeData = yield episodeResponse.json();
                const episodeInfoContainer = document.createElement("div");
                episodeInfoContainer.classList.add("inset-0", "bg-gray-300", "rounded-md", "border", "border-gray-400", "p-4");
                episodeInfoContainer.innerHTML = `
        <p>Name: ${episodeData.name}</p>
        <p>Air Date: ${episodeData.air_date}</p>
        <p>Episode Code: ${episodeData.episode}</p>
      `;
                episodeInfoContainer.addEventListener("click", () => {
                    clearMainContent(() => {
                        displayEpisodeInfo(episodeData);
                    });
                });
                episodesContainer.appendChild(episodeInfoContainer);
            }
            catch (error) {
                console.error("Error fetching episode data:", error);
            }
        }
        return episodesContainer;
    });
}
function displayCharacterInfo(characterData) {
    return __awaiter(this, void 0, void 0, function* () {
        const mainContent = document.querySelector(".flex-1");
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
        const episodeInfoListContainer = document.getElementById("episodeInfoList");
        const locationName = document.querySelector(".locationName");
        console.log("characterData.location:", characterData.location);
        locationName === null || locationName === void 0 ? void 0 : locationName.addEventListener("click", () => {
            clearMainContent(() => {
                displayLocationInfo(characterData.location);
            });
        });
        const episodesContainer = yield fetchAndRenderEpisodes(characterData.episode);
        episodeInfoListContainer.appendChild(episodesContainer);
    });
}
function displayLocationInfo(location) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const locationResponse = yield fetch(location.url);
            if (!locationResponse.ok) {
                throw new Error(`HTTP error! Status: ${locationResponse.status}`);
            }
            const locationData = yield locationResponse.json();
            const mainContent = document.querySelector(".flex-1");
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
            const residentsListContainer = document.getElementById("residentsList");
            for (const characterUrl of locationData.residents) {
                if (typeof characterUrl === "string") {
                    yield fetchAndRenderCharacter(characterUrl, residentsListContainer);
                }
                else {
                    console.error("Invalid character URL:", characterUrl);
                }
            }
        }
        catch (error) {
            console.error("Error fetching location data:", error);
        }
    });
}
function loadMoreEpisodes() {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield fetchEpisodesInfo(urlAPI);
        const maxPages = info.pages;
        const loadMoreButton = document.getElementById("loadMore");
        const sidebar = document.querySelector(".w-64");
        if (isLoading || currentPage >= maxPages) {
            loadMoreButton.remove();
            return;
        }
        isLoading = true;
        currentPage++;
        const nextPageUrl = `${urlAPI}?page=${currentPage}`;
        const episodes = yield fetchEpisodes(nextPageUrl);
        renderEpisodes(episodes);
    });
}
document.addEventListener("DOMContentLoaded", function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const episodes = yield fetchEpisodes(urlAPI);
            renderEpisodes(episodes);
            const loadMoreButton = document.getElementById("loadMore");
            if (!isLoading) {
                loadMoreButton.addEventListener("click", loadMoreEpisodes);
            }
        }
        catch (error) {
            console.error("Error:", error);
        }
        finally {
            isLoading = false;
        }
    });
});
export {};
