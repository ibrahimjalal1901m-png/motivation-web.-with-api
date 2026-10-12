import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  CheckSquare,
  Square,
  RotateCcw,
  CheckCheck,
  Plus,
  Trash2,
  Calendar,
  Flame,
  ShieldCheck,
  Sliders,
  Eye,
  Lock,
} from 'lucide-react';
import { useToast } from './Toast';
import { soundFx } from '../utils/audio';

export interface DisciplineTask {
  id: string;
  title: string;
  subtitle: string;
  isCustom?: boolean;
}

const DEFAULT_TASKS: DisciplineTask[] = [
  {
    id: 'task-1',
    title: 'Complete primary needle-mover prior to 11:00 AM',
    subtitle: 'Zero interruptions, communication apps severed, pure execution',
  },
  {
    id: 'task-2',
    title: 'Read 20 pages of high-yield literature',
    subtitle: 'Strategy, philosophy, capital allocation, or domain craftsmanship',
  },
  {
    id: 'task-3',
    title: 'Intense physical conditioning session',
    subtitle: 'Cardiovascular strain, heavy lifting, or VO2 max elevation',
  },
  {
    id: 'task-4',
    title: 'Eliminate all cheap dopamine consumption',
    subtitle: 'No mindless feed scrolling, algorithm traps, or passive indulgence',
  },
  {
    id: 'task-5',
    title: "Evening audit & tomorrow's battle order",
    subtitle: 'Clear workspace, review scorecard, lock in the exact 3 targets',
  },
];

interface StoredChecklistState {
  date: string; // ISO date string YYYY-MM-DD
  completedIds: string[];
  customTasks: DisciplineTask[];
  streak: number;
}

export const DisciplineSection: React.FC = () => {
  const { showToast } = useToast();
  const todayDateString = new Date().toISOString().split('T')[0];

  const [storedData, setStoredData] = useLocalStorage<StoredChecklistState>(
    'aspire_discipline_checklist_v2',
    {
      date: todayDateString,
      completedIds: [],
      customTasks: [],
      streak: 1,
    }
  );

  const [newCustomTaskTitle, setNewCustomTaskTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Validate date on load: if stored date is prior day, handle new day reset
  useEffect(() => {
    if (storedData.date !== todayDateString) {
      const allPrevDone =
        DEFAULT_TASKS.length > 0 &&
        storedData.completedIds.length >= DEFAULT_TASKS.length + storedData.customTasks.length;

      setStoredData((prev) => ({
        ...prev,
        date: todayDateString,
        completedIds: [], // reset tasks for fresh day
        streak: allPrevDone ? prev.streak + 1 : prev.streak, // advance streak if completed
      }));
    }
  }, [todayDateString, storedData.date, storedData.completedIds.length, storedData.customTasks.length, setStoredData]);

  const allTasks = [...DEFAULT_TASKS, ...storedData.customTasks];
  const completedCount = storedData.completedIds.length;
  const totalCount = allTasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleTask = (taskId: string) => {
    soundFx.playClick();
    const isAlreadyDone = storedData.completedIds.includes(taskId);
    const nextCompleted = isAlreadyDone
      ? storedData.completedIds.filter((id) => id !== taskId)
      : [...storedData.completedIds, taskId];

    setStoredData((prev) => ({
      ...prev,
      completedIds: nextCompleted,
    }));

    if (!isAlreadyDone) {
      if (nextCompleted.length === allTasks.length) {
        soundFx.playComplete();
        showToast('Daily Protocol 100% Completed', 'Mastery forged in deliberate action.', 'success');
      }
    }
  };

  const handleResetDay = () => {
    soundFx.playClick();
    setStoredData((prev) => ({
      ...prev,
      completedIds: [],
    }));
    showToast('Protocol Reset', 'Checklist cleared for re-execution', 'info');
  };

  const handleCompleteAll = () => {
    soundFx.playComplete();
    setStoredData((prev) => ({
      ...prev,
      completedIds: allTasks.map((t) => t.id),
    }));
    showToast('All Tasks Marked Complete', 'Elite caliber execution', 'success');
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomTaskTitle.trim()) return;

    soundFx.playSave();
    const newTask: DisciplineTask = {
      id: `custom-${Date.now()}`,
      title: newCustomTaskTitle.trim(),
      subtitle: 'Custom Executive Directive',
      isCustom: true,
    };

    setStoredData((prev) => ({
      ...prev,
      customTasks: [...prev.customTasks, newTask],
    }));

    setNewCustomTaskTitle('');
    setShowAddForm(false);
    showToast('Custom Habit Added', 'Added to your daily protocol', 'success');
  };

  const handleDeleteCustomTask = (taskId: string) => {
    soundFx.playClick();
    setStoredData((prev) => ({
      ...prev,
      customTasks: prev.customTasks.filter((t) => t.id !== taskId),
      completedIds: prev.completedIds.filter((id) => id !== taskId),
    }));
    showToast('Habit Removed', 'Custom task removed', 'info');
  };

  const displayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <section id="daily-discipline" className="py-20 lg:py-28 bg-[#050505]/80 backdrop-blur-md relative border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Editorial Left Column (7 Columns) */}
        <div data-reveal="heading" className="lg:col-span-7 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-[0.24em] text-[#D4AF37]">
              Uncompromising Tenets
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-white leading-[1.08]">
              Success Is Earned, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5CC] via-[#FFE08A] to-[#D4AF37]">
                Not Given.
              </span>
            </h2>
            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed pt-2">
              The world celebrates the spectacle of triumph while discarding the brutal, monotonous hours spent in obscurity. Your destiny isn’t constructed in the light; it is cemented in the cold, unyielding silence before dawn.
            </p>
          </div>

          {/* Three Foundational Pillars */}
          <div className="flex flex-col gap-4">
            <div className="p-6 rounded-xl bg-[#111114] border border-white/[0.06] hover:border-[#D4AF37]/50 flex flex-col gap-2 transition-all gold-glow-card">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#FFE08A]" /> 1. Habit Architecture
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">SYSTEMS OVER WILLPOWER</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Willpower is a depleting resource. Elite operators construct daily frictionless routines that eliminate deliberation. Execute automatically without debate.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#111114] border border-white/[0.06] hover:border-[#D4AF37]/50 flex flex-col gap-2 transition-all gold-glow-card">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#FFE08A]" /> 2. Asymmetric Focus
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">SIGNAL OVER NOISE</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Ignore the noise of the herd. Concentrate total cognitive firepower exclusively onto the few levers capable of multi-fold outcomes.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#111114] border border-white/[0.06] hover:border-[#D4AF37]/50 flex flex-col gap-2 transition-all gold-glow-card">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FFE08A]" /> 3. Ironclad Resilience
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">COMPOUND STRENGTH</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Adversity is not an interruption to the mission; adversity is the catalyst of growth. Embrace resistance as your greatest compass.
              </p>
            </div>
          </div>
        </div>

        {/* Live Daily Interactive Checklist (5 Columns) */}
        <div data-reveal="fade-up" className="lg:col-span-5 rounded-2xl bg-[#111114] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 gold-glow-card">
          {/* Header with Date & Streak */}
          <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
            <div className="flex flex-col">
              <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-white tracking-tight">
                Daily Discipline Protocol
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono text-[#FFE08A] mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>PROTOCOL DATE: {displayDate.toUpperCase()}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FFE08A] text-xs font-mono font-bold">
              <Flame className="w-4 h-4 text-[#FFE08A]" />
              <span>{storedData.streak}D STREAK</span>
            </div>
          </div>

          {/* Progress Completion Index */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 uppercase tracking-wider">Completion Index</span>
              <span className="text-[#FFE08A] font-bold text-sm">{percentage}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-zinc-900 overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFE08A] transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>{completedCount} of {totalCount} directives locked</span>
              <span>{percentage === 100 ? 'Status: Unstoppable' : 'Status: In Progress'}</span>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {allTasks.map((task) => {
              const isDone = storedData.completedIds.includes(task.id);
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3.5 rounded-lg border transition-all duration-200 cursor-pointer select-none flex items-start justify-between gap-3 ${
                    isDone
                      ? 'bg-[#18181C]/60 border-[#D4AF37]/40 text-zinc-400'
                      : 'bg-[#18181C] border-white/[0.06] hover:border-white/20 text-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className="mt-0.5 text-zinc-500 hover:text-[#F5D76E] transition-colors focus:outline-none"
                    >
                      {isDone ? (
                        <CheckSquare className="w-5 h-5 text-[#F5D76E]" />
                      ) : (
                        <Square className="w-5 h-5 text-zinc-500" />
                      )}
                    </button>
                    <div className="flex flex-col">
                      <span
                        className={`text-xs sm:text-sm font-medium leading-snug ${
                          isDone ? 'line-through text-zinc-400' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="text-[11px] text-zinc-400 mt-0.5">
                        {task.subtitle}
                      </span>
                    </div>
                  </div>

                  {task.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomTask(task.id);
                      }}
                      className="text-zinc-600 hover:text-rose-400 p-1"
                      title="Delete custom task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Custom Task Form */}
          {showAddForm ? (
            <form onSubmit={handleAddCustomTask} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter personal daily discipline..."
                value={newCustomTaskTitle}
                onChange={(e) => setNewCustomTaskTitle(e.target.value)}
                autoFocus
                className="flex-1 px-3 py-2 rounded bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded bg-[#D4AF37] text-[#080808] font-bold text-xs uppercase"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-2 py-2 text-zinc-500 hover:text-zinc-300 text-xs"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                soundFx.playClick();
                setShowAddForm(true);
              }}
              className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-[#F5D76E] flex items-center gap-1.5 transition-colors self-start"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Directive</span>
            </button>
          )}

          {/* Protocol Controls Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
            <button
              onClick={handleResetDay}
              className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Day</span>
            </button>

            <button
              onClick={handleCompleteAll}
              className="px-3.5 py-1.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-[#F5D76E] text-[11px] font-mono uppercase tracking-widest flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Check All</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
