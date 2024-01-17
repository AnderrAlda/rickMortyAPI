"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
const apiUrl = "https://rickandmortyapi.com/api/episode";
let currentPage = 1;
function fetchEpisodes(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${apiUrl}?page=${page}`);
        const data = yield response.json();
        return data.results;
    });
}
function loadEpisodes() {
    return __awaiter(this, void 0, void 0, function* () {
        const episodes = yield fetchEpisodes(currentPage);
        const sidebar = document.getElementById("episodeList");
        episodes.forEach((episode) => {
            const listItem = document.createElement("li");
            listItem.className = "mb-2";
            const link = document.createElement("a");
            link.href = episode.url;
            link.textContent = episode.name;
            link.className = "text-blue-500 hover:text-blue-700";
            listItem.appendChild(link);
            sidebar === null || sidebar === void 0 ? void 0 : sidebar.appendChild(listItem);
        });
        const loadMoreButton = document.getElementById("loadMore");
        if (loadMoreButton) {
            loadMoreButton.style.display = currentPage < 3 ? "block" : "none";
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    loadEpisodes();
});
(_a = document.getElementById("loadMore")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    currentPage++;
    loadEpisodes();
});
