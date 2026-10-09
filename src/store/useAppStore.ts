import { create } from 'zustand';
import { ActionNode, ActionEdge, EngineStats, TierLogEntry, NodeType, RawChatMessage } from '@/types';
import { BatteryAwareEngine } from '@/services/tieredEngine';
import { INITIAL_RAW_CHATS } from '@/data/mockChats';

interface AppState {
  // Graph & Data
  rawMessages: RawChatMessage[];
  nodes: ActionNode[];
  edges: ActionEdge[];
  stats: EngineStats;
  tierLogs: TierLogEntry[];
  
  // UI & Selection
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  filterType: 'all' | NodeType;
  searchQuery: string;
  activeView: '3d-graph' | 'tiered-engine' | 'raw-inbox' | 'audio-briefing';
  isSidePanelOpen: boolean;

  // Power & Engine Controls
  powerMode: 'turbo' | 'balanced' | 'eco';
  batteryPct: number;
  isProcessing: boolean;
  processingStep: string;
  isAudioPlaying: boolean;
  audioProgress: number;
  isIngestModalOpen: boolean;

  // Actions
  initialize: () => Promise<void>;
  selectNode: (nodeId: string | null) => void;
  setHoveredNode: (nodeId: string | null) => void;
  closeSidePanel: () => void;
  setFilterType: (filter: 'all' | NodeType) => void;
  setSearchQuery: (query: string) => void;
  setActiveView: (view: '3d-graph' | 'tiered-engine' | 'raw-inbox' | 'audio-briefing') => void;
  setPowerMode: (mode: 'turbo' | 'balanced' | 'eco') => Promise<void>;
  setBatteryPct: (pct: number) => void;
  toggleActionItem: (nodeId: string, actionId: string) => void;
  reprocessChats: () => Promise<void>;
  addMessageAndReprocess: (msg: Omit<RawChatMessage, 'id' | 'rawTime'>) => Promise<void>;
  toggleAudioBriefing: () => void;
  setIngestModalOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  rawMessages: INITIAL_RAW_CHATS,
  nodes: [],
  edges: [],
  tierLogs: [],
  stats: {
    totalRawMessages: INITIAL_RAW_CHATS.length,
    noiseFilteredCount: 10,
    tier1FilterRatio: 0.45,
    tier2EntityCount: 6,
    tier3SynthesizedCount: 6,
    processingTimeMs: 42,
    batteryJoulesSaved: 5.4,
    simulatedBatteryPct: 88,
    powerSavingMode: 'balanced',
    isLocalOnly: true,
  },
  selectedNodeId: null,
  hoveredNodeId: null,
  filterType: 'all',
  searchQuery: '',
  activeView: '3d-graph',
  isSidePanelOpen: false,
  powerMode: 'balanced',
  batteryPct: 88,
  isProcessing: false,
  processingStep: '',
  isAudioPlaying: false,
  audioProgress: 0,
  isIngestModalOpen: false,

  initialize: async () => {
    await get().reprocessChats();
  },

  selectNode: (nodeId) => {
    set({
      selectedNodeId: nodeId,
      isSidePanelOpen: nodeId !== null,
    });
  },

  setHoveredNode: (nodeId) => {
    set({ hoveredNodeId: nodeId });
  },

  closeSidePanel: () => {
    set({
      selectedNodeId: null,
      isSidePanelOpen: false,
    });
  },

  setFilterType: (filter) => {
    set({ filterType: filter });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setActiveView: (view) => {
    set({ activeView: view });
  },

  setPowerMode: async (mode) => {
    set({ powerMode: mode });
    await get().reprocessChats();
  },

  setBatteryPct: (pct) => {
    set({ batteryPct: pct });
    if (pct < 20 && get().powerMode !== 'eco') {
      get().setPowerMode('eco');
    }
  },

  toggleActionItem: (nodeId, actionId) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) => {
        if (node.id !== nodeId) return node;
        const updatedActions = node.metadata.actionItems.map((act) =>
          act.id === actionId ? { ...act, completed: !act.completed } : act
        );
        return {
          ...node,
          metadata: {
            ...node.metadata,
            actionItems: updatedActions,
          },
        };
      });
      return { nodes: updatedNodes };
    });
  },

  reprocessChats: async () => {
    set({ isProcessing: true, processingStep: 'Initializing Tier 1 Zero-Cost Regex Pruner...' });
    
    // Simulate brief asynchronous pipeline stages for realistic UI telemetry
    await new Promise((r) => setTimeout(r, 120));
    set({ processingStep: 'Tier 2: Extracting Who, What, When Entities...' });
    
    await new Promise((r) => setTimeout(r, 140));
    set({ processingStep: `Tier 3: Running On-Device SLM Synthesizer (${get().powerMode.toUpperCase()} mode)...` });
    
    await new Promise((r) => setTimeout(r, 180));

    const result = await BatteryAwareEngine.processRawChats(get().rawMessages, {
      batteryPct: get().batteryPct,
      powerMode: get().powerMode,
    });

    set({
      nodes: result.nodes,
      edges: result.edges,
      stats: result.stats,
      tierLogs: result.tierLogs,
      isProcessing: false,
      processingStep: '',
    });
  },

  addMessageAndReprocess: async (newMsg) => {
    const created: RawChatMessage = {
      ...newMsg,
      id: `msg-${Date.now()}`,
      rawTime: Date.now(),
    };
    set((state) => ({
      rawMessages: [created, ...state.rawMessages],
    }));
    await get().reprocessChats();
  },

  toggleAudioBriefing: () => {
    const nextState = !get().isAudioPlaying;
    set({ isAudioPlaying: nextState });

    if (nextState) {
      // Mock progress loop
      const interval = setInterval(() => {
        const cur = get().audioProgress;
        if (!get().isAudioPlaying || cur >= 100) {
          clearInterval(interval);
          set({ isAudioPlaying: false, audioProgress: 0 });
        } else {
          set({ audioProgress: cur + 2 });
        }
      }, 250);
    } else {
      set({ audioProgress: 0 });
    }
  },

  setIngestModalOpen: (open) => {
    set({ isIngestModalOpen: open });
  },
}));
