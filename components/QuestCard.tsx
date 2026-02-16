import React from 'react';
import { QuestStep, StepStatus, Language } from '../types';
import { Lock, CheckCircle, AlertTriangle, HelpCircle, Shield } from 'lucide-react';

interface Props {
  step: QuestStep;
  status?: StepStatus;
  lang: Language;
  onClick: () => void;
  isAvailable: boolean;
}

export const QuestCard: React.FC<Props> = ({ step, status, lang, onClick, isAvailable }) => {
  const isLocked = !isAvailable && !status;
  
  const getStyles = () => {
    if (isLocked) return 'border-slate-800 bg-slate-900/40 opacity-40 grayscale pointer-events-none';
    if (status === 'completed_pos') return 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
    if (status === 'completed_neg') return 'border-rose-500/50 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
    if (status === 'mitigated') return 'border-amber-500/50 bg-amber-500/5';
    return 'border-slate-700 hover:border-quest-info bg-slate-800/60 active:bg-slate-800';
  };

  const getIcon = () => {
    if (isLocked) return <Lock className="w-5 h-5 text-slate-600" />;
    if (status === 'completed_pos') return <CheckCircle className="w-6 h-6 text-emerald-400 fill-emerald-400/10" />;
    if (status === 'completed_neg') return <AlertTriangle className="w-6 h-6 text-rose-400 fill-rose-400/10" />;
    if (status === 'mitigated') return <Shield className="w-6 h-6 text-amber-400 fill-amber-400/10" />;
    return <HelpCircle className="w-6 h-6 text-slate-400" />;
  };

  return (
    <div 
      onClick={isLocked ? undefined : onClick}
      className={`relative p-4 rounded-xl border-l-4 transition-all duration-300 ${getStyles()} ${!isLocked ? 'cursor-pointer active:scale-[0.98]' : ''}`}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-black font-mono text-slate-500 bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-800">
              {step.sectionRef}
            </span>
            {step.enemy && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 font-black flex items-center gap-1 uppercase tracking-tighter">
                {step.enemy.icon} {step.enemy.name_es}
              </span>
            )}
          </div>
          <h3 className="font-black text-white text-base sm:text-lg leading-tight truncate">
            {lang === 'es' ? step.title_es : step.title_de}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
            {lang === 'es' ? step.description_es : step.description_de}
          </p>
        </div>
        <div className="shrink-0 pt-1">
          {getIcon()}
        </div>
      </div>
    </div>
  );
};