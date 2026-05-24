/** SugarCube-inspired denormalized knowledge matrix (unstructured → structured). */

export interface MemoryNode {
  id: string;
  entityId: string;
  sourceType: "intake" | "session_log" | "operator_note" | "system";
  facets: Record<string, string | number | boolean | string[]>;
  densityScore: number;
  createdAt: string;
}

export function ingestUnstructuredLog(
  entityId: string,
  sourceType: MemoryNode["sourceType"],
  rawText: string,
): MemoryNode {
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const facets: Record<string, string | string[]> = {
    summary: lines[0] ?? "",
    keywords: lines.flatMap((l) => l.split(/\s+/).filter((w) => w.length > 4)).slice(0, 12),
    line_count: lines.length,
  };
  const densityScore = Math.min(1, lines.length / 20);
  return {
    id: `mem-${crypto.randomUUID()}`,
    entityId,
    sourceType,
    facets,
    densityScore,
    createdAt: new Date().toISOString(),
  };
}

export function mergeMemoryNodes(nodes: MemoryNode[]): Record<string, unknown> {
  const matrix: Record<string, unknown> = { entity_ids: [...new Set(nodes.map((n) => n.entityId))] };
  for (const node of nodes) {
    matrix[node.sourceType] = node.facets;
  }
  matrix.avg_density =
    nodes.length === 0 ? 0 : nodes.reduce((s, n) => s + n.densityScore, 0) / nodes.length;
  return matrix;
}
