import { mergeMemoryNodes, type MemoryNode } from "../spine/crm/memory-matrix";
import type { SpineEntity } from "../spine/types";

export interface SugarCubeBundle {
  version: "1.0";
  generatedAt: string;
  entity: SpineEntity | null;
  memoryMatrix: Record<string, unknown>;
  modules: {
    intake: boolean;
    scheduling: boolean;
    billing: boolean;
    crm: boolean;
  };
  instructionsForAi: string;
}

export function exportSugarCubeBundle(
  entity: SpineEntity | null,
  memoryNodes: MemoryNode[],
): SugarCubeBundle {
  return {
    version: "1.0",
    generatedAt: new Date().toISOString(),
    entity,
    memoryMatrix: mergeMemoryNodes(memoryNodes),
    modules: {
      intake: true,
      scheduling: true,
      billing: true,
      crm: true,
    },
    instructionsForAi:
      "Recreate operational intent from memoryMatrix and entity lifecycle. Layer 2 compliance wrappers are out of scope for this bundle.",
  };
}
