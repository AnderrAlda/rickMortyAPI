// TypeScript code
const apiUrl = "https://rickandmortyapi.com/api/episode";
let currentPage = 1;

async function fetchEpisodes(page: number): Promise<any> {
  const response = await fetch(`${apiUrl}?page=${page}`);
  const data = await response.json();
  return data.results;
}

async function loadEpisodes() {
  const episodes = await fetchEpisodes(currentPage);
  const sidebar = document.getElementById("episodeList");

  episodes.forEach((episode: any) => {
    const listItem = document.createElement("li");
    listItem.className = "mb-2";
    const link = document.createElement("a");
    link.href = episode.url;
    link.textContent = episode.name;
    link.className = "text-blue-500 hover:text-blue-700";
    listItem.appendChild(link);
    sidebar?.appendChild(listItem);
  });

  const loadMoreButton = document.getElementById("loadMore");
  if (loadMoreButton) {
    loadMoreButton.style.display = currentPage < 3 ? "block" : "none"; // Assuming there are 3 pages in total
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadEpisodes();
});

document.getElementById("loadMore")?.addEventListener("click", () => {
  currentPage++;
  loadEpisodes();
});
