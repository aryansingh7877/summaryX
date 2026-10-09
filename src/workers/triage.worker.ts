import {
  parseRawWhatsAppLines,
  classifyRawMessages,
} from '@/services/whatsappParser';
import { collectEngineTelemetry } from '@/lib/engine/telemetry';
import { WorkerProgressMessage, WorkerResultMessage } from '@/types/triage';

// WebWorker global scope context compatible with DOM tsconfig
const ctx = self as unknown as {
  addEventListener: (type: string, listener: (e: MessageEvent) => void) => void;
  postMessage: (message: unknown) => void;
};

ctx.addEventListener('message', async (e: MessageEvent) => {
  const { type, payload } = e.data || {};

  if (type !== 'PROCESS_CHAT' || !payload?.rawText) {
    return;
  }

  const { rawText, chatTitle = 'WhatsApp Group' } = payload;
  const startTime = performance.now();

  try {
    // ------------------------------------------------------------------------
    // STAGE 1: Fast Regex Pre-Filter & Tokenizer (O(N) Noise Suppression)
    // ------------------------------------------------------------------------
    const rawMessages = parseRawWhatsAppLines(rawText);

    const progressMsg1: WorkerProgressMessage = {
      stage: 'PARSING',
      progress: 35,
      telemetry: {
        executionTimeMs: Math.round(performance.now() - startTime),
        workerThreadId: 'triage-worker-core-0',
      },
    };
    ctx.postMessage(progressMsg1);

    // ------------------------------------------------------------------------
    // STAGE 2: Temporal & Entity Extractor (Dates, Mentions, Priority Scores)
    // ------------------------------------------------------------------------
    // Small micro-tick to allow main thread progress rendering
    await new Promise((resolve) => setTimeout(resolve, 8));

    const progressMsg2: WorkerProgressMessage = {
      stage: 'TRIAGING',
      progress: 75,
      telemetry: {
        executionTimeMs: Math.round(performance.now() - startTime),
        workerThreadId: 'triage-worker-core-0',
      },
    };
    ctx.postMessage(progressMsg2);

    // ------------------------------------------------------------------------
    // STAGE 3: Dynamic State Aggregator (Action Items, Decisions, Templates)
    // ------------------------------------------------------------------------
    const classification = classifyRawMessages(rawMessages, chatTitle);

    const telemetry = await collectEngineTelemetry(
      rawText,
      classification.stats.totalParsed,
      classification.stats.noiseFilteredCount,
      startTime,
      'triage-worker-core-0'
    );

    const completedMsg: WorkerResultMessage = {
      stage: 'COMPLETED',
      progress: 100,
      payload: {
        rawMessages,
        urgentActions: classification.urgentActions,
        keyDecisions: classification.keyDecisions,
        resolvedOrNoise: classification.resolvedOrNoise,
        actionItems: classification.actionItems,
        stats: classification.stats,
      },
      telemetry,
    };

    ctx.postMessage(completedMsg);
  } catch (error) {
    ctx.postMessage({
      stage: 'ERROR',
      progress: 0,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
