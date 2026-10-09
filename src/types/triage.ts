export interface RawChatMessage {
  id: string;
  index: number;
  timestamp: string;
  sender: string;
  messageBody: string;
}

export type TriageCategory = 'urgent' | 'fyi' | 'resolved';

export interface DynamicTriageCard {
  id: string;
  sourceMessageIndex: number;
  chatName: string;
  sender: string;
  timestamp: string;
  category: TriageCategory;
  summary: string;
  priorityBadge: 'P0' | 'P1' | 'P2';
  actionTags: string[];
  suggestedReply: string;
  entities: {
    dates: string[];
    names: string[];
    tags: string[];
  };
}

export interface DynamicAutoTask {
  id: string;
  sourceMessageIndex: number;
  title: string;
  completed: boolean;
  assignee: string;
  deadline?: string;
  priority: 'p0' | 'p1' | 'p2';
  sourceSender: string;
}

export interface IngestionStats {
  totalParsed: number;
  noiseFilteredCount: number;
  urgentCount: number;
  fyiCount: number;
  actionItemsCount: number;
  parsedAt: string | null;
}

export type ThemeMode = 'daylight' | 'midnight';

export type TemporalPreset = 'all' | '1h' | '3h' | '6h' | 'custom';

export interface TemporalFilterState {
  preset: TemporalPreset;
  cutoffMinutes: number | null; // Minutes from midnight (0-1440)
  displayLabel: string;        // e.g. "Filtering: Last 3 Hours"
  dialAngle: number;           // 0 to 360 degrees
  isScrubbing: boolean;
}
