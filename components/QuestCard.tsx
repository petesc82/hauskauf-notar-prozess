import React from 'react';
import { QuestStep, StepStatus, Language } from '../types';
import { Lock, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

interface Props {
  step: QuestStep;
  status?: StepStatus;
  lang: Language;
  onClick: () => void;
  isAvailable: boolean;
}

export const QuestCard: React.FC<Props> = ({ step, status, lang, onClick, isAvailable }) => {
  const isLocked = !isAvailable && !status;
  
  const getBorderColor = () => {
    if (isLocked) return 'border-gray-700 opacity-50';
    if (status === 'completed_pos') return 'border-quest-success bg-green-900/10';
    if (status === 'completed_neg') return 'border-quest-danger bg-red-900/10';
    if (status === 'mitigated') return 'border-quest-gold bg-yellow-900/10';
    return 'border-gray-600 hover:border-quest-info bg-quest-panel';
  };

  const getIcon = () => {
    if (isLocked) return <Lock className="w-5 h-5 text-gray-500" />;
    if (status === 'completed_pos') return <CheckCircle className="w-6 h-6 text-quest-success" />;
    if (status === 'completed_neg') return <AlertTriangle className="w-6 h-6 text-quest-danger" />;
    if (status === 'mitigated') return <CheckCircle className="w-6 h-6 text-quest-gold" />;
    return <HelpCircle className="w-6 h-6 text-gray-400" />;
  };

  return (
    <div 
      onClick={isLocked ? undefined : onClick}
      className={`relative p-4 rounded-lg border-l-4 shadow-md transition-all duration-200 mb-4 ${getBorderColor()} ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-gray-500">{step.sectionRef}</span>
            {step.enemy && (
              <span className="text-xs px-2 py-0.5 rounded bg-red-900/30 text-red-300 border border-red-900/50 flex items-center gap-1">
                {step.enemy.icon} {step.enemy.name_es}
              </span>
            )}
          </div>
          <h3 className="font-bold text-gray-200 text-lg leading-tight">
            {lang === 'es' ? step.title_es : step.title_de}
          </h3>
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
            {lang === 'es' ? step.description_es : step.description_de}
          </p>
        </div>
        <div className="ml-3 mt-1">
          {getIcon()}
        </div>
      </div>
    </div>
  );
};