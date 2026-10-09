import {
  WorkerProgressMessage,
  WorkerResultMessage,
  EngineTelemetry,
  RawChatMessage,
  DynamicTriageCard,
  DynamicAutoTask,
  IngestionStats,
} from '@/types/triage';
import {
  parseRawWhatsAppLines,
  classifyRawMessages,
} from '@/services/whatsappParser';
import { collectEngineTelemetry } from './telemetry';

export interface OffThreadTriageResult {
  rawMessages: RawChatMessage[];
  urgentActions: DynamicTriageCard[];
  keyDecisions: DynamicTriageCard[];
  resolvedOrNoise: DynamicTriageCard[];
  actionItems: DynamicAutoTask[];
  stats: IngestionStats;
  telemetry: EngineTelemetry;
}

/**
 * Dispatches WhatsApp triage workload to off-thread Web Worker.
 * Preserves 60 FPS on main thread during heavy regex & entity extraction.
 */
export async function executeOffThreadTriage(
  rawText: string,
  chatTitle: string = 'WhatsApp Group',
  onProgress?: (progress: number, stage: string) => void
): Promise<OffThreadTriageResult> {
  const startTime = performance.now();

  // Check Web Worker capability in browser environment
  if (typeof window !== 'undefined' && typeof window.Worker !== 'undefined') {
    try {
      return await new Promise<OffThreadTriageResult>((resolve, reject) => {
        let worker: Worker | null = null;
        try {
          worker = new Worker(new URL('../../workers/triage.worker.ts', import.meta.url));
        } catch (workerInitErr) {
          console.warn('[TriageWorker] Web Worker instantiation fallback:', workerInitErr);
          throw workerInitErr;
        }

        worker.onmessage = (event: MessageEvent<WorkerProgressMessage | WorkerResultMessage>) => {
          const msg = event.data;

          if (msg.stage === 'COMPLETED') {
            const resultMsg = msg as WorkerResultMessage;
            worker?.terminate();
            resolve({
              ...resultMsg.payload,
              telemetry: resultMsg.telemetry,
            });
          } else if (msg.stage === 'ERROR') {
            worker?.terminate();
            reject(new Error('Worker triage processing failed'));
          } else {
            onProgress?.(msg.progress, msg.stage);
          }
        };

        worker.onerror = (err) => {
          worker?.terminate();
          reject(err);
        };

        worker.postMessage({
          type: 'PROCESS_CHAT',
          payload: { rawText, chatTitle },
        });
      });
    } catch {
      // Graceful fallback to deterministic sync execution
    }
  }

  // Synchronous fallback (e.g. SSR, test runners, or workers disabled)
  onProgress?.(30, 'PARSING');
  const rawMessages = parseRawWhatsAppLines(rawText);

  onProgress?.(70, 'TRIAGING');
  const classification = classifyRawMessages(rawMessages, chatTitle);

  onProgress?.(100, 'COMPLETED');
  const telemetry = await collectEngineTelemetry(
    rawText,
    classification.stats.totalParsed,
    classification.stats.noiseFilteredCount,
    startTime,
    'main-thread-fallback'
  );

  return {
    rawMessages,
    urgentActions: classification.urgentActions,
    keyDecisions: classification.keyDecisions,
    resolvedOrNoise: classification.resolvedOrNoise,
    actionItems: classification.actionItems,
    stats: classification.stats,
    telemetry,
  };
}
