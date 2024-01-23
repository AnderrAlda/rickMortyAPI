import { Character } from "./character";

export interface EpisodeResult {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: Character[];
  url: string;
  created: string;
}
