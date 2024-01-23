import { EpisodeInfo } from "./episodeInfo";
import { EpisodeResult } from "./episodeResult";

export interface Episode {
  info: EpisodeInfo;
  results: EpisodeResult[];
}
