'use client';

import React, { useState } from 'react';
import { useTriageStore } from '@/store/useTriageStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  Sparkles,
  ShieldCheck,
  FileText,
  Play,
} from 'lucide-react';

const HACKATHON_SAMPLE_CHAT = `[09/10/26, 10:05:12 AM] Alex Rivera: Good morning team! Hackathon submission day is here 🚀
[09/10/26, 10:05:40 AM] Maya Lin: gm everyone!!
[09/10/26, 10:06:00 AM] Dev Liam: morning 🙌
[09/10/26, 10:07:15 AM] Alex Rivera: Quick sync: Mentors evaluation round has been moved UP to 4:30 PM today!
[09/10/26, 10:08:20 AM] Maya Lin: cool, slide deck is almost done
[09/10/26, 10:09:05 AM] Dev Liam: ok
[09/10/26, 10:10:12 AM] Alex Rivera: 🚨 @Liam URGENT: The organizers require our live staging link before 3:00 PM sharp or we lose the demo slot! Please make sure to finalize the Docker deploy script before 3:00 PM!
[09/10/26, 10:11:30 AM] Dev Liam: Understood, I am on it now. Will finish deployment before 2:45 PM.
[09/10/26, 10:12:00 AM] Alex Rivera: 👍 thanks
[09/10/26, 10:14:22 AM] Maya Lin: I updated the Figma deck with high-contrast accessibility colors. Can someone please review slide 4 and slide 7 before 2:00 PM?
[09/10/26, 10:15:10 AM] Alex Rivera: Will review slides by 1:30 PM after testing the auth API.
[09/10/26, 10:16:00 AM] Dev Liam: 👍
[09/10/26, 10:18:40 AM] Organizer Bot: Reminder: Final code freeze and portal submission closes at 11:59 PM tonight. Late submissions cannot be accepted.
[09/10/26, 10:20:10 AM] Alex Rivera: Approved prototype architecture is finalized and merged to main.`;

export const ChatIngestionModal: React.FC = () => {
  const {
    isIngestionModalOpen,
    setIngestionModalOpen,
    ingestAndProcessChat,
  } = useTriageStore();

  const [chatTitle, setChatTitle] = useState('AI Hackathon Group 🚀');
  const [pastedText, setPastedText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [parsingStage, setParsingStage] = useState<
    'idle' | 'sanitizing' | 'extracting' | 'triaging' | 'done'
  >('idle');
  const [progressPct, setProgressPct] = useState(0);

  if (!isIngestionModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setChatTitle(file.name.replace('.txt', '').replace('_chat', 'WhatsApp Chat'));

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        setPastedText(content);
        executePipeline(content, file.name.replace('.txt', ''));
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setChatTitle(file.name.replace('.txt', '').replace('_chat', 'WhatsApp Chat'));

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        setPastedText(content);
        executePipeline(content, file.name.replace('.txt', ''));
      }
    };
    reader.readAsText(file);
  };

  const executePipeline = async (textToProcess: string, title: string) => {
    if (!textToProcess.trim()) return;

    setParsingStage('sanitizing');
    setProgressPct(25);

    // Run off-thread triage pipeline via Web Worker
    await ingestAndProcessChat(textToProcess, title, (progress, stage) => {
      setProgressPct(progress);
      if (stage === 'PARSING') setParsingStage('sanitizing');
      else if (stage === 'TRIAGING') setParsingStage('triaging');
      else if (stage === 'COMPLETED') setParsingStage('done');
    });

    setProgressPct(100);
    setParsingStage('done');

    await new Promise((r) => setTimeout(r, 300));
    setParsingStage('idle');
    setProgressPct(0);
    setIngestionModalOpen(false);
  };

  const handleLoadSample = () => {
    setChatTitle('AI Hackathon Group 🚀');
    setPastedText(HACKATHON_SAMPLE_CHAT);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/40 backdrop-blur-sm select-none"
        onClick={() => setIngestionModalOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl max-h-[92dvh] rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white shadow-2xl flex flex-col overflow-hidden font-sans text-[#0F172A]"
        >
          {/* Header */}
          <div className="p-3.5 sm:p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-[#0F172A]">
                  Ingest WhatsApp Chat
                </h3>
                <p className="text-[11px] font-mono text-slate-500">
                  Client-Side Regex Classifier • Zero Cloud Uploads
                </p>
              </div>
            </div>

            <button
              onClick={() => setIngestionModalOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto custom-scrollbar flex-1">
            {/* Quick Demo Option */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50">
              <div>
                <div className="text-xs font-bold text-[#0F172A]">
                  Fast Demo Test
                </div>
                <div className="text-[11px] text-slate-500">
                  Pre-fills realistic conversational noise, deadlines, and mentions
                </div>
              </div>
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-3 py-1.5 rounded-full bg-slate-200/70 hover:bg-slate-300/80 text-slate-800 text-xs font-semibold transition-colors border border-slate-300/60 shadow-2xs"
              >
                Load Sample Chat
              </button>
            </div>

            {/* Native HTML File Input Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative p-5 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-rose-500 bg-rose-50/50'
                  : 'border-slate-300 hover:border-rose-400 bg-slate-50/60'
              }`}
            >
              <Upload className="w-6 h-6 text-rose-500 mb-1.5" />
              <div className="text-xs font-bold text-[#0F172A]">
                Upload WhatsApp Export <code className="text-rose-600 font-mono">.txt</code>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Drag and drop file here or click to browse
              </p>
              {/* Native HTML File Input */}
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {/* Chat Title */}
            <div>
              <label className="text-[11px] font-mono text-slate-600 font-semibold block mb-1">
                Chat / Group Title
              </label>
              <input
                type="text"
                value={chatTitle}
                onChange={(e) => setChatTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs text-[#0F172A] focus:outline-none focus:border-rose-500 shadow-2xs transition-all font-sans"
              />
            </div>

            {/* Live Chat Simulator Textarea */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-mono text-slate-600 font-semibold">
                  Live Chat Simulator (Paste raw WhatsApp messages here)
                </label>
                <span className="text-[10px] font-mono text-slate-500">
                  {pastedText ? `${pastedText.split('\n').length} lines` : '0 lines'}
                </span>
              </div>
              <textarea
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="[09/10/26, 10:10:12 AM] Alex: 🚨 URGENT: The organizers require our staging link before 3:00 PM!"
                className="w-full p-3.5 rounded-2xl border border-slate-300 bg-white text-xs font-mono text-[#0F172A] focus:outline-none focus:border-rose-500 shadow-2xs custom-scrollbar leading-relaxed transition-all"
              />
            </div>

            {/* Simulated Parsing Progress Bar */}
            {parsingStage !== 'idle' && (
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-600 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-rose-500" />
                    {parsingStage === 'sanitizing' && 'Sanitizing locally (Filtering Noise)...'}
                    {parsingStage === 'extracting' && 'Extracting entities (Who, What, When)...'}
                    {parsingStage === 'triaging' && 'Triaging urgency (P0/P1/FYI)...'}
                    {parsingStage === 'done' && 'Dynamic Ingestion Complete!'}
                  </span>
                  <span className="text-slate-600 font-bold">{progressPct}%</span>
                </div>

                <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-200">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#EC4899] to-[#F97316]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Local-First Privacy Guarantee */}
            <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-center gap-2 text-[11px] text-emerald-800">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>
                <strong>Zero Cloud Uploads:</strong> Regex parsing and entity classification execute 100% inside browser memory.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200/80 flex items-center justify-end gap-2.5 bg-slate-50/70">
            <button
              onClick={() => setIngestionModalOpen(false)}
              disabled={parsingStage !== 'idle'}
              className="px-3.5 py-1.5 rounded-full text-xs font-sans text-slate-600 hover:text-[#0F172A] hover:bg-slate-200/60 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={() => executePipeline(pastedText, chatTitle)}
              disabled={parsingStage !== 'idle' || !pastedText.trim()}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#EC4899] via-[#F43F5E] to-[#F97316] hover:opacity-95 text-white font-semibold text-xs font-sans flex items-center gap-1.5 shadow-md shadow-rose-500/20 transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{parsingStage !== 'idle' ? 'Processing...' : 'Process Live Stream'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
