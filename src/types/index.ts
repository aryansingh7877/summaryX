export type NodeType = 'urgent' | 'debate' | 'resolved';

export interface RawChatMessage {
  id: string;
  sender: string;
  avatar: string;
  role: string;
  channel: string;
  content: string;
  timestamp: string;
  rawTime: number; // unix ms
  sentiment?: 'positive' | 'neutral' | 'urgent' | 'conflict';
}

export interface ActionItem {
  id: string;
  title: string;
  assignee: string;
  completed: boolean;
  priority: 'p0' | 'p1' | 'p2';
}

export interface ActionNode {
  id: string;
  type: NodeType;
  label: string;
  summary: string;
  timestamp: string;
  channel: string;
  urgencyScore: number; // 0 - 100
  position: [number, number, number]; // 3D coordinates [x, y, z]
  metadata: {
    participants: string[];
    actionItems: ActionItem[];
    tierProcessed: 1 | 2 | 3;
    batteryImpact: string; // e.g. "0.02 mWh"
    confidence: number; // 0 - 1
    keyArguments?: string[];
    deadline?: string;
    rawMessageIds: string[];
    tier1FilteredCount: number;
    entitiesDetected: {
      who: string[];
      what: string;
      when: string | null;
    };
  };
}

export interface ActionEdge {
  id: string;
  source: string; // node id
  target: string; // node id
  relation: string; // "blocks" | "depends on" | "debates" | "sub-task" | "relates to"
  type: NodeType;
  strength: number; // 0.1 to 1.0
}

export interface EngineStats {
  totalRawMessages: number;
  noiseFilteredCount: number;
  tier1FilterRatio: number; // e.g. 0.62 (62% filtered out zero cost)
  tier2EntityCount: number;
  tier3SynthesizedCount: number;
  processingTimeMs: number;
  batteryJoulesSaved: number;
  simulatedBatteryPct: number;
  powerSavingMode: 'turbo' | 'balanced' | 'eco';
  isLocalOnly: boolean;
}

export interface GraphData {
  nodes: ActionNode[];
  edges: ActionEdge[];
  stats: EngineStats;
}

export interface TierLogEntry {
  timestamp: string;
  tier: 1 | 2 | 3;
  action: string;
  detail: string;
  cost: string;
}
