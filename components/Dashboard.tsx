import React from 'react';
import { useGame } from '../context/GameContext';
import { Shield, Trophy, AlertOctagon } from 'lucide-react';
import { StepState } from '../types';

export const Dashboard: React.FC = () => {
  const { state, process } = useGame();
  const lang = state.language;

  const totalSteps = process.steps.length;
  const completedSteps = Object.values(state.steps).filter((s: StepState) => s.status === 'completed_pos' || s.status === 'mitigated').length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  const activeRisks = Object.keys(state.steps).filter(id => {
    const s = state.steps[id];
    return s.status === 'completed_neg' && process.steps.find(ps => ps.id === id)?.negativeOutcome.stopFlag;
  });

  return (
    <div className="p-4 space-y-6 pb-24">
      
      {/* Boss Bar */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏰</span>
            <span className="font-bold text-gray-100">Cierre Notarial</span>
          </div>
          <span className="text-quest-gold font-mono font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-quest-info to-quest-success h-4 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Level {state.level}</span>
          <span>{state.xp} XP</span>
        </div>
      </div>

      {/* Critical Risks */}
      {activeRisks.length > 0 && (
        <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-xl animate-pulse">
          <div className="flex items-center gap-2 text-red-500 font-bold mb-2">
            <AlertOctagon className="w-5 h-5" />
            {lang === 'es' ? 'Riesgos Críticos (STOP)' : 'Kritische Risiken (STOP)'}
          </div>
          <ul className="list-disc list-inside text-sm text-red-300">
            {activeRisks.map(id => {
              const step = process.steps.find(s => s.id === id);
              return <li key={id}>{lang === 'es' ? step?.title_es : step?.title_de}</li>;
            })}
          </ul>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <Trophy className="w-6 h-6 text-quest-gold mb-2" />
          <div className="text-2xl font-bold text-white">{completedSteps}/{totalSteps}</div>
          <div className="text-xs text-gray-400">{lang === 'es' ? 'Quests Completadas' : 'Quests abgeschlossen'}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <Shield className="w-6 h-6 text-quest-info mb-2" />
          <div className="text-2xl font-bold text-white">{state.level}</div>
          <div className="text-xs text-gray-400">{lang === 'es' ? 'Rango de Agente' : 'Agenten-Rang'}</div>
        </div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-xl text-center text-sm text-gray-500">
        <p>{lang === 'es' ? 'Progreso guardado localmente.' : 'Fortschritt lokal gespeichert.'}</p>
        <p className="mt-1 text-xs">Offline PWA Mode Active</p>
      </div>

    </div>
  );
};