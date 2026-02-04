/**
 * Sound configuration constants shared across components.
 */

export interface AmbientSound {
  id: string;
  labelKey: string;
  url: string;
}

export const AMBIENT_SOUNDS: AmbientSound[] = [
  { id: "rain", labelKey: "sounds.rain", url: "/sounds/ambient/rain_light.mp3" },
  { id: "ocean", labelKey: "sounds.ocean", url: "/sounds/ambient/ocean_waves.mp3" },
  { id: "forest", labelKey: "sounds.forest", url: "/sounds/ambient/forest.mp3" },
  { id: "tibetan_bowls", labelKey: "sounds.tibetanBowls", url: "/sounds/ambient/tibetan_bowls.mp3" },
  { id: "wind_chimes", labelKey: "sounds.windChimes", url: "/sounds/ambient/wind_chimes.mp3" },
  { id: "white_noise", labelKey: "sounds.whiteNoise", url: "/sounds/ambient/white_noise.mp3" },
  { id: "river", labelKey: "sounds.river", url: "/sounds/ambient/river.mp3" },
  { id: "campfire", labelKey: "sounds.campfire", url: "/sounds/ambient/campfire.mp3" },
  { id: "wind", labelKey: "sounds.wind", url: "/sounds/ambient/wind.mp3" },
  { id: "birds", labelKey: "sounds.birds", url: "/sounds/ambient/birds.mp3" },
];

/** Lookup ambient sound URL by id. Returns undefined if not found. */
export function getAmbientUrl(id: string): string | undefined {
  return AMBIENT_SOUNDS.find((s) => s.id === id)?.url;
}

export const BELL_SOUNDS = [
  { id: "tibetan_bowl", labelKey: "settings.bells.tibetanBowl" },
  { id: "singing_bowl", labelKey: "settings.bells.singingBowl" },
  { id: "zen_gong", labelKey: "settings.bells.zenGong" },
  { id: "soft_chime", labelKey: "settings.bells.softChime" },
] as const;

export function getBellUrl(id: string): string {
  return `/sounds/bells/${id}.mp3`;
}
