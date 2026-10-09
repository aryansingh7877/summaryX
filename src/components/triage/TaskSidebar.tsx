'use client';

import React, { useState } from 'react';
import { useTriageStore } from '@/store/useTriageStore';
import { TimeScrubberClock } from './TimeScrubberClock';
import {
  Plus,
  Calendar,
  Check,
  ListTodo,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TaskSidebar: React.FC = () => {
  const {
    actionItems,
    toggleTask,
    addTask,
    taskFilter,
    setTaskFilter,
    isSidebarOpen,
    setSidebarOpen,
  } = useTriageStore();
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'p0' | 'p1' | 'p2'>('p1');

  const completedCount = actionItems.filter((t) => t.completed).length;
  const totalCount = actionItems.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = actionItems.filter((t) => {
    if (taskFilter === 'pending') return !t.completed;
    if (taskFilter === 'completed') return t.completed;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask(newTitle.trim(), newPriority, 'Today');
    setNewTitle('');
  };

  const renderContent = () => (
    <>
      {/* 1. Functional Temporal Scrubber Clock Widget */}
      <div className="p-3 sm:p-3.5 border-b border-slate-200/70">
        <TimeScrubberClock />
      </div>

      {/* 2. Action Items Header & Progress */}
      <div className="p-3 sm:p-4 border-b border-slate-200/70">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold font-sans tracking-tight text-[#0F172A]">
              Your Action Items
            </h2>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-700">
            {completedCount}/{totalCount} done
          </span>
        </div>

        {/* Minimalist Progress Bar */}
        <div className="w-full h-1.5 rounded-full overflow-hidden mb-3 bg-slate-200/70">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="h-full rounded-full bg-emerald-500"
          />
        </div>

        {/* Tactile Filter Buttons (Frosted Pills) */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl border border-slate-200/70 bg-slate-100/70 text-xs font-sans">
          <button
            onClick={() => setTaskFilter('all')}
            className={`flex-1 py-1 rounded-lg text-center font-medium transition-all ${
              taskFilter === 'all'
                ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setTaskFilter('pending')}
            className={`flex-1 py-1 rounded-lg text-center font-medium transition-all ${
              taskFilter === 'pending'
                ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            Pending ({totalCount - completedCount})
          </button>
          <button
            onClick={() => setTaskFilter('completed')}
            className={`flex-1 py-1 rounded-lg text-center font-medium transition-all ${
              taskFilter === 'completed'
                ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            Done ({completedCount})
          </button>
        </div>
      </div>

      {/* 3. Task Checklist Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => (
            <motion.div
              layout
              key={task.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => toggleTask(task.id)}
              className={`group p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-2.5 ${
                task.completed
                  ? 'bg-white/50 border-slate-200/50 opacity-60'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Tactile Rounded Square Checkbox */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                  task.completed
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                    : 'bg-white border-slate-300 group-hover:border-emerald-500'
                }`}
              >
                {task.completed && (
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 600, damping: 25 }}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </motion.div>
                )}
              </motion.button>

              {/* Task Details */}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-xs font-sans leading-snug font-medium transition-all ${
                    task.completed
                      ? 'line-through text-slate-400'
                      : 'text-[#0F172A]'
                  }`}
                >
                  {task.title}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px] font-mono">
                  {/* Priority Tag Pill */}
                  <span
                    className={`px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      task.priority === 'p0'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : task.priority === 'p1'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {task.priority.toUpperCase()}
                  </span>

                  {/* Assigned Person's Name */}
                  <span className="text-emerald-700 font-sans font-medium">
                    {task.assignee.startsWith('Assigned to')
                      ? task.assignee
                      : `Assigned to ${task.assignee}`}
                  </span>

                  {/* Deadline */}
                  {task.deadline && (
                    <span className="flex items-center gap-0.5 text-slate-500">
                      <Calendar className="w-2.5 h-2.5 opacity-70" />
                      <span>{task.deadline}</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="py-14 px-4 text-center text-xs font-sans text-slate-500">
            No action items in this filter.
          </div>
        )}
      </div>

      {/* 4. Inline Quick Add Task */}
      <form
        onSubmit={handleCreateTask}
        className="p-3 border-t border-slate-200/70 bg-white/60 shrink-0"
      >
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="+ Quick task (press Enter)..."
            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white text-xs font-sans text-[#0F172A] placeholder-slate-400 transition-all focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="p-1.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-30 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </form>
    </>
  );

  return (
    <>
      {/* 1. Desktop Docked Sidebar (lg and up) */}
      {isSidebarOpen && (
        <aside className="hidden lg:flex w-76 xl:w-80 h-full flex-col select-none shrink-0 transition-all duration-200 border-l border-slate-200/80 bg-slate-50/50 backdrop-blur-xl text-[#0F172A] overflow-hidden">
          {renderContent()}
        </aside>
      )}

      {/* 2. Mobile Slide-Over Drawer (< lg) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-sm sm:max-w-md h-full flex flex-col bg-white shadow-2xl border-l border-slate-200 text-[#0F172A] overflow-hidden"
            >
              {/* Mobile Drawer Title Bar with Close Button */}
              <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold font-sans text-[#0F172A]">
                    Clock & Action Items
                  </span>
                  {actionItems.length > 0 && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                      {actionItems.length}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-full text-slate-500 hover:text-black hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {renderContent()}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
