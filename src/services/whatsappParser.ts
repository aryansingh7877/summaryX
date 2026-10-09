import {
  RawChatMessage,
  DynamicTriageCard,
  DynamicAutoTask,
  IngestionStats,
} from '@/types/triage';

// Exact WhatsApp line extraction regex
const WHATSAPP_LINE_REGEX =
  /\[?(\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}(?::\d{2})?\s?[APMapm]*)\]?\s-?\s?([^:]+):\s(.*)/;

// Noise regex: short acknowledgments, emoji cascades, single words
const NOISE_REGEX = /^(\bok\b|k|cool|yes|no|done|👍|😂|lol|haha|thanks|thx|gm|hey|hi)[\.!\?]*$/i;

// Urgent tokens
const URGENT_REGEX = /\b(urgent|asap|deadline|eod|due|submit|blocker|review|payment|cut|shutdown|emergency|immediately)\b/i;

// Time & date patterns
const TIME_REGEX = /\b(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?|today|tomorrow|EOD|ASAP|Friday|Monday|Tuesday|Wednesday|Thursday|Saturday|Sunday|by \d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/i;

// Decision / FYI tokens
const DECISION_REGEX = /\b(approved|decided|finalized|update|announcement|link|http|prototype|confirmed|signed off)\b/i;

// Action item task generator regex
const TASK_PATTERNS = /\b(need to|please|make sure to|assigned to|fix|transfer|deploy|submit|review|prepare|finish)\b/i;

export const SAMPLE_HACKATHON_CHAT_TEXT = `[09/10/26, 08:30:12 AM] Alex Rivera: Good morning team! Hackathon submission day is here 🚀
[09/10/26, 08:32:40 AM] Maya Lin: gm everyone!!
[09/10/26, 08:35:00 AM] Dev Liam: morning 🙌
[09/10/26, 09:15:15 AM] Alex Rivera: Quick sync: Mentors evaluation round has been moved UP to 4:30 PM today!
[09/10/26, 09:30:20 AM] Maya Lin: cool, slide deck is almost done
[09/10/26, 09:35:05 AM] Dev Liam: ok
[09/10/26, 10:10:12 AM] Alex Rivera: 🚨 @Liam URGENT: The organizers require our live staging link before 3:00 PM sharp or we lose the demo slot! Please make sure to finalize the Docker deploy script before 3:00 PM!
[09/10/26, 10:11:30 AM] Dev Liam: Understood, I am on it now. Will finish deployment before 2:45 PM.
[09/10/26, 10:12:00 AM] Alex Rivera: 👍 thanks
[09/10/26, 11:14:22 AM] Maya Lin: I updated the Figma deck with high-contrast accessibility colors. Can someone please review slide 4 and slide 7 before 2:00 PM?
[09/10/26, 11:25:10 AM] Alex Rivera: Will review slides by 1:30 PM after testing the auth API.
[09/10/26, 11:30:00 AM] Dev Liam: 👍
[09/10/26, 11:45:40 AM] Organizer Bot: Reminder: Final code freeze and portal submission closes at 11:59 PM tonight. Late submissions cannot be accepted.
[09/10/26, 11:55:10 AM] Alex Rivera: Approved prototype architecture is finalized and merged to main.`;

/**
 * Step 1: Parse raw chat text lines into RawChatMessage[]
 */
export function parseRawWhatsAppLines(rawText: string): RawChatMessage[] {
  const lines = rawText.split(/\r?\n/);
  const rawMessages: RawChatMessage[] = [];

  let currentMsg: RawChatMessage | null = null;
  let msgCounter = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (
      trimmed.includes('Messages and calls are end-to-end encrypted') ||
      trimmed.includes('<Media omitted>') ||
      trimmed.includes('image omitted') ||
      trimmed.includes('sticker omitted')
    ) {
      continue;
    }

    const match = trimmed.match(WHATSAPP_LINE_REGEX);

    if (match) {
      if (currentMsg) {
        rawMessages.push(currentMsg);
      }
      currentMsg = {
        id: `raw-${msgCounter}`,
        index: msgCounter,
        timestamp: match[1].trim(),
        sender: match[2].trim(),
        messageBody: match[3].trim(),
      };
      msgCounter++;
    } else if (currentMsg) {
      currentMsg.messageBody += ' ' + trimmed;
    }
  }

  if (currentMsg) {
    rawMessages.push(currentMsg);
  }

  // Fallback line-by-line if standard regex wasn't matched
  if (rawMessages.length === 0 && lines.length > 0) {
    const validLines = lines.filter((l) => l.trim().length > 0);
    validLines.forEach((line, idx) => {
      const parts = line.split(':');
      const sender = parts.length > 1 ? parts[0].trim() : `User ${idx + 1}`;
      const body = parts.length > 1 ? parts.slice(1).join(':').trim() : line.trim();
      rawMessages.push({
        id: `raw-${idx}`,
        index: idx,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender,
        messageBody: body,
      });
    });
  }

  return rawMessages;
}

/**
 * Step 2: Deterministic Classifier on any slice of messages
 */
export function classifyRawMessages(
  messages: RawChatMessage[],
  chatTitle: string = 'Imported Chat'
): {
  urgentActions: DynamicTriageCard[];
  keyDecisions: DynamicTriageCard[];
  resolvedOrNoise: DynamicTriageCard[];
  actionItems: DynamicAutoTask[];
  stats: IngestionStats;
} {
  let noiseFilteredCount = 0;
  const urgentActions: DynamicTriageCard[] = [];
  const keyDecisions: DynamicTriageCard[] = [];
  const actionItems: DynamicAutoTask[] = [];

  messages.forEach((msg) => {
    const text = msg.messageBody;
    const words = text.split(/\s+/).filter(Boolean);

    // 1. Noise Filter Check
    const isNoisePattern = NOISE_REGEX.test(text.trim());
    const isTooShort = words.length < 4 && !URGENT_REGEX.test(text);

    if (isNoisePattern || isTooShort) {
      noiseFilteredCount++;
      return;
    }

    // 2. Action Item Extraction
    if (TASK_PATTERNS.test(text)) {
      const timeMatch = text.match(TIME_REGEX);
      const isUrgentTask = URGENT_REGEX.test(text);

      let taskTitle = text;
      if (taskTitle.length > 60) {
        taskTitle = taskTitle.slice(0, 58) + '...';
      }

      let assignee = 'Assigned to You';
      const mentionMatch = text.match(/@([a-zA-Z0-9_\-]+)/);
      if (mentionMatch) {
        assignee = `Assigned to ${mentionMatch[1]}`;
      } else if (msg.sender) {
        assignee = `From ${msg.sender}`;
      }

      actionItems.push({
        id: `task-${actionItems.length + 1}-${msg.index}`,
        sourceMessageIndex: msg.index,
        title: taskTitle,
        completed: false,
        assignee,
        deadline: timeMatch ? timeMatch[0] : 'Pending',
        priority: isUrgentTask ? 'p0' : 'p1',
        sourceSender: msg.sender,
      });
    }

    // 3. Urgent Actions (P0 / P1)
    if (URGENT_REGEX.test(text)) {
      const timeMatch = text.match(TIME_REGEX);
      const actionTags: string[] = [];

      if (timeMatch) {
        actionTags.push(`Due ${timeMatch[0]}`);
      } else {
        actionTags.push('High Priority');
      }

      if (text.includes('@')) {
        actionTags.push('Direct Mention');
      }

      if (/payment|fee|transfer|dues/i.test(text)) {
        actionTags.push('Requires Payment');
      } else if (/review|approve|sign-off/i.test(text)) {
        actionTags.push('Requires Sign-off');
      }

      let suggestedReply = 'Acknowledged — working on this now and will update shortly.';
      if (/payment|fee|transfer/i.test(text)) {
        suggestedReply = 'Transferred the amount via UPI. Reference receipt shared.';
      } else if (/review|slide|deck/i.test(text)) {
        suggestedReply = 'Reviewed the materials — looks ready for submission.';
      }

      urgentActions.push({
        id: `urgent-${msg.index}-${msg.id}`,
        sourceMessageIndex: msg.index,
        chatName: chatTitle,
        sender: msg.sender,
        timestamp: msg.timestamp,
        category: 'urgent',
        summary: `${msg.sender}: "${text.length > 95 ? text.slice(0, 92) + '...' : text}"`,
        priorityBadge: /urgent|asap|blocker|deadline|emergency/i.test(text) ? 'P0' : 'P1',
        actionTags,
        suggestedReply,
        entities: {
          dates: timeMatch ? [timeMatch[0]] : [],
          names: [msg.sender],
          tags: ['Action Required', 'Urgent'],
        },
      });
      return;
    }

    // 4. Key Decisions & FYI
    if (DECISION_REGEX.test(text)) {
      const timeMatch = text.match(TIME_REGEX);
      const actionTags: string[] = ['FYI Update'];

      if (/approved|confirmed|signed off/i.test(text)) {
        actionTags.push('Decision Finalized');
      }
      if (/http|link/i.test(text)) {
        actionTags.push('Link Shared');
      }

      keyDecisions.push({
        id: `fyi-${msg.index}-${msg.id}`,
        sourceMessageIndex: msg.index,
        chatName: chatTitle,
        sender: msg.sender,
        timestamp: msg.timestamp,
        category: 'fyi',
        summary: `${msg.sender}: "${text.length > 95 ? text.slice(0, 92) + '...' : text}"`,
        priorityBadge: 'P2',
        actionTags,
        suggestedReply: 'Noted with thanks.',
        entities: {
          dates: timeMatch ? [timeMatch[0]] : [],
          names: [msg.sender],
          tags: ['Key Decision', 'FYI'],
        },
      });
      return;
    }

    // 5. Informative conversation (long enough)
    if (words.length >= 6) {
      keyDecisions.push({
        id: `fyi-${msg.index}-${msg.id}`,
        sourceMessageIndex: msg.index,
        chatName: chatTitle,
        sender: msg.sender,
        timestamp: msg.timestamp,
        category: 'fyi',
        summary: `${msg.sender}: "${text.length > 95 ? text.slice(0, 92) + '...' : text}"`,
        priorityBadge: 'P2',
        actionTags: ['Discussion'],
        suggestedReply: 'Understood.',
        entities: {
          dates: [],
          names: [msg.sender],
          tags: ['Discussion'],
        },
      });
    } else {
      noiseFilteredCount++;
    }
  });

  const stats: IngestionStats = {
    totalParsed: messages.length,
    noiseFilteredCount,
    urgentCount: urgentActions.length,
    fyiCount: keyDecisions.length,
    actionItemsCount: actionItems.length,
    parsedAt: new Date().toLocaleTimeString(),
  };

  return {
    urgentActions,
    keyDecisions,
    resolvedOrNoise: [],
    actionItems,
    stats,
  };
}

/**
 * Combined parser and classifier
 */
export function parseAndClassifyWhatsAppChat(
  rawText: string,
  chatTitle: string = 'Imported Chat'
) {
  const rawMessages = parseRawWhatsAppLines(rawText);
  const result = classifyRawMessages(rawMessages, chatTitle);
  return {
    rawMessages,
    ...result,
  };
}

