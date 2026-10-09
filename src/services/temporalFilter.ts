import { RawChatMessage } from '@/types/triage';

/**
 * Parses time string like "10:18 AM", "09/10/26, 10:18 AM", "14:30"
 * into minutes from midnight (0 - 1440).
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;

  // Match 10:18 AM or 10:18:22 AM or 14:30
  const match = timeStr.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*([APMapm]{2})?/);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3]?.toUpperCase();

  if (ampm === 'PM' && hours < 12) {
    hours += 12;
  } else if (ampm === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

/**
 * Converts minutes (0-1440) to clean display time e.g. "10:30 AM"
 */
export function minutesToDisplayTime(totalMinutes: number): string {
  const norm = Math.max(0, Math.min(1439, Math.round(totalMinutes)));
  let hours = Math.floor(norm / 60);
  const minutes = norm % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';

  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;

  const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minStr} ${ampm}`;
}

/**
 * Filter messages based on cutoff minutes
 */
export function filterMessagesByCutoff(
  messages: RawChatMessage[],
  cutoffMinutes: number | null
): RawChatMessage[] {
  if (cutoffMinutes === null || messages.length === 0) {
    return messages;
  }

  return messages.filter((msg) => {
    const msgMinutes = parseTimeToMinutes(msg.timestamp);
    return msgMinutes >= cutoffMinutes;
  });
}
