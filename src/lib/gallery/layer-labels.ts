export type ArchitectureLayer = 1 | 2 | 3;

export const LAYER_LABELS: Record<ArchitectureLayer, string> = {
  1: "Layer 1 — Spine",
  2: "Layer 2 — Wrapper",
  3: "Layer 3 — Interface",
};

export function layerLabel(layer: ArchitectureLayer): string {
  return LAYER_LABELS[layer];
}
