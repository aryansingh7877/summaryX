import { create } from 'zustand';
import {
  RawChatMessage,
  DynamicTriageCard,
  DynamicAutoTask,
  TriageCategory,
  IngestionStats,
  ThemeMode,
  TemporalPreset,
  TemporalFilterState,
  EngineTelemetry,
} from '@/types/triage';
import {
  parseRawWhatsAppLines,
  classifyRawMessages,
} from '@/services/whatsappParser';
import {
  parseTimeToMinutes,
  minutesToDisplayTime,
  filterMessagesByCutoff,
} from '@/services/temporalFilter';
import { executeOffThreadTriage } from '@/lib/engine/triageWorkerClient';

interface TriageState {
  // Theme state
  theme: ThemeMode;
  toggleTheme: () => void;

  // Temporal Scrubber Clock State
  temporalFilter: TemporalFilterState;
  setTemporalPreset: (preset: TemporalPreset) => void;
  setDialAngle: (angle: number) => void;

  // Dynamic Ingested State (Empty by default!)
  rawMessages: RawChatMessage[];
  urgentActions: DynamicTriageCard[];
  keyDecisions: DynamicTriageCard[];
  resolvedOrNoise: DynamicTriageCard[];
  actionItems: DynamicAutoTask[];
  suppressedNoiseCount: number;
  stats: IngestionStats | null;
  telemetry: EngineTelemetry | null;
  activeChatTitle: string;

  // UI state
  selectedCard: DynamicTriageCard | null;
  isIngestionModalOpen: boolean;
  isSidebarOpen: boolean;
  activeTab: 'all' | TriageCategory;
  viewMode: 'columns' | 'list';
  searchQuery: string;
  taskFilter: 'all' | 'pending' | 'completed';

  // Actions
  ingestAndProcessChat: (
    rawText: string,
    chatTitle?: string,
    onProgress?: (progress: number, stage: string) => void
  ) => Promise<void>;
  moveCard: (cardId: string, targetCategory: TriageCategory) => void;
  toggleTask: (taskId: string) => void;
  addTask: (title: string, priority?: 'p0' | 'p1' | 'p2', deadline?: string) => void;
  selectCard: (card: DynamicTriageCard | null) => void;
  setIngestionModalOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTab: (tab: 'all' | TriageCategory) => void;
  setViewMode: (mode: 'columns' | 'list') => void;
  setSearchQuery: (query: string) => void;
  setTaskFilter: (filter: 'all' | 'pending' | 'completed') => void;
  clearAll: () => void;
}

export const useTriageStore = create<TriageState>((set, get) => ({
  // Default to daylight macOS floating light theme
  theme: 'daylight',
  toggleTheme: () => {
    const next = get().theme === 'midnight' ? 'daylight' : 'midnight';
    set({ theme: next });
  },

  temporalFilter: {
    preset: 'all',
    cutoffMinutes: null,
    displayLabel: 'Showing All Messages',
    dialAngle: 0,
    isScrubbing: false,
  },

  rawMessages: [],
  urgentActions: [],
  keyDecisions: [],
  resolvedOrNoise: [],
  actionItems: [],
  suppressedNoiseCount: 0,
  stats: null,
  telemetry: null,
  activeChatTitle: '',

  selectedCard: null,
  isIngestionModalOpen: false,
  isSidebarOpen: true,
  activeTab: 'all',
  viewMode: 'columns',
  searchQuery: '',
  taskFilter: 'all',

  ingestAndProcessChat: async (
    rawText: string,
    chatTitle: string = 'WhatsApp Group',
    onProgress?: (progress: number, stage: string) => void
  ) => {
    try {
      const result = await executeOffThreadTriage(rawText, chatTitle, onProgress);

      set({
        rawMessages: result.rawMessages,
        urgentActions: result.urgentActions,
        keyDecisions: result.keyDecisions,
        resolvedOrNoise: result.resolvedOrNoise,
        actionItems: result.actionItems,
        suppressedNoiseCount: result.stats.noiseFilteredCount,
        stats: result.stats,
        telemetry: result.telemetry,
        activeChatTitle: chatTitle,
        selectedCard: null,
        temporalFilter: {
          preset: 'all',
          cutoffMinutes: null,
          displayLabel: 'Showing All Messages',
          dialAngle: 0,
          isScrubbing: false,
        },
      });
    } catch (err) {
      console.error('[useTriageStore] Failed to triage chat:', err);
    }
  },

  setTemporalPreset: (preset: TemporalPreset) => {
    const { rawMessages, activeChatTitle } = get();
    if (rawMessages.length === 0) {
      set((s) => ({
        temporalFilter: { ...s.temporalFilter, preset, cutoffMinutes: null, displayLabel: 'Showing All' },
      }));
      return;
    }

    // Determine latest message time
    const lastMsg = rawMessages[rawMessages.length - 1];
    const latestMinutes = parseTimeToMinutes(lastMsg.timestamp);

    let cutoffMinutes: number | null = null;
    let displayLabel = 'Showing All Messages';
    let dialAngle = 0;

    if (preset === '1h') {
      cutoffMinutes = Math.max(0, latestMinutes - 60);
      displayLabel = `Filtering: Last 1h (After ${minutesToDisplayTime(cutoffMinutes)})`;
      dialAngle = (cutoffMinutes % 720) * 0.5;
    } else if (preset === '3h') {
      cutoffMinutes = Math.max(0, latestMinutes - 180);
      displayLabel = `Filtering: Last 3h (After ${minutesToDisplayTime(cutoffMinutes)})`;
      dialAngle = (cutoffMinutes % 720) * 0.5;
    } else if (preset === '6h') {
      cutoffMinutes = Math.max(0, latestMinutes - 360);
      displayLabel = `Filtering: Last 6h (After ${minutesToDisplayTime(cutoffMinutes)})`;
      dialAngle = (cutoffMinutes % 720) * 0.5;
    } else {
      cutoffMinutes = null;
      displayLabel = 'Showing All Messages';
      dialAngle = 0;
    }

    const filtered = filterMessagesByCutoff(rawMessages, cutoffMinutes);
    const classification = classifyRawMessages(filtered, activeChatTitle);

    set({
      temporalFilter: {
        preset,
        cutoffMinutes,
        displayLabel,
        dialAngle,
        isScrubbing: false,
      },
      urgentActions: classification.urgentActions,
      keyDecisions: classification.keyDecisions,
      actionItems: classification.actionItems,
      suppressedNoiseCount: classification.stats.noiseFilteredCount,
      stats: classification.stats,
    });
  },

  setDialAngle: (angle: number) => {
    const { rawMessages, activeChatTitle } = get();
    if (rawMessages.length === 0) return;

    // Map 0-360 degrees to hours on clock (0 to 12 hours -> 720 minutes)
    // angle 0 deg = 12:00, 90 deg = 3:00, 180 deg = 6:00, 270 deg = 9:00
    const normalizedAngle = (angle % 360 + 360) % 360;
    const hoursFraction = (normalizedAngle / 360) * 12;
    // Map to morning or afternoon based on chat
    const firstMsgMin = parseTimeToMinutes(rawMessages[0]?.timestamp || '08:00 AM');
    const isPM = firstMsgMin >= 720;
    const totalMinutes = (isPM ? 720 : 0) + Math.round(hoursFraction * 60);

    const cutoffMinutes = totalMinutes;
    const displayLabel = `Scrubbed: After ${minutesToDisplayTime(cutoffMinutes)}`;

    const filtered = filterMessagesByCutoff(rawMessages, cutoffMinutes);
    const classification = classifyRawMessages(filtered, activeChatTitle);

    set({
      temporalFilter: {
        preset: 'custom',
        cutoffMinutes,
        displayLabel,
        dialAngle: normalizedAngle,
        isScrubbing: true,
      },
      urgentActions: classification.urgentActions,
      keyDecisions: classification.keyDecisions,
      actionItems: classification.actionItems,
      suppressedNoiseCount: classification.stats.noiseFilteredCount,
      stats: classification.stats,
    });
  },

  moveCard: (cardId: string, targetCategory: TriageCategory) => {
    const { urgentActions, keyDecisions, resolvedOrNoise } = get();
    const allCards = [...urgentActions, ...keyDecisions, ...resolvedOrNoise];
    const targetCard = allCards.find((c) => c.id === cardId);
    if (!targetCard) return;

    const nextUrgent = urgentActions.filter((c) => c.id !== cardId);
    const nextFyi = keyDecisions.filter((c) => c.id !== cardId);
    const nextResolved = resolvedOrNoise.filter((c) => c.id !== cardId);

    const updatedCard = { ...targetCard, category: targetCategory };

    if (targetCategory === 'urgent') nextUrgent.unshift(updatedCard);
    else if (targetCategory === 'fyi') nextFyi.unshift(updatedCard);
    else if (targetCategory === 'resolved') nextResolved.unshift(updatedCard);

    set({
      urgentActions: nextUrgent,
      keyDecisions: nextFyi,
      resolvedOrNoise: nextResolved,
    });
  },

  toggleTask: (taskId: string) => {
    set((state) => ({
      actionItems: state.actionItems.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  },

  addTask: (title: string, priority = 'p1', deadline = 'Today') => {
    set((state) => ({
      actionItems: [
        {
          id: `task-manual-${Date.now()}`,
          sourceMessageIndex: -1,
          title,
          completed: false,
          assignee: 'Assigned to You',
          deadline,
          priority,
          sourceSender: 'Manual',
        },
        ...state.actionItems,
      ],
    }));
  },

  selectCard: (card) => set({ selectedCard: card }),

  setIngestionModalOpen: (open) => set({ isIngestionModalOpen: open }),

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setTab: (tab) => set({ activeTab: tab }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setTaskFilter: (filter) => set({ taskFilter: filter }),

  clearAll: () => {
    set({
      rawMessages: [],
      urgentActions: [],
      keyDecisions: [],
      resolvedOrNoise: [],
      actionItems: [],
      suppressedNoiseCount: 0,
      stats: null,
      telemetry: null,
      activeChatTitle: '',
      selectedCard: null,
      temporalFilter: {
        preset: 'all',
        cutoffMinutes: null,
        displayLabel: 'Showing All Messages',
        dialAngle: 0,
        isScrubbing: false,
      },
    });
  },
}));
