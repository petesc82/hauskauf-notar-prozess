import React from 'react';
import { useGame } from '../context/GameContext';
import { Shield, Trophy, AlertOctagon, Zap, ArrowRight } from 'lucide-react';
import { StepState, QuestStep } from '../types';

interface DashboardProps {
  onQuestClick: (quest: QuestStep) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onQuestClick }) => {
  const { state, process } = useGame();
  const lang = state.language;

  const totalSteps = process.steps.length;
  const completedSteps = Object.values(state.steps).filter((s: StepState) => s.status === 'completed_pos' || s.status === 'mitigated').length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  const activeRisks = Object.keys(state.steps).filter(id => {
    const s = state.steps[id];
    return s.status === 'completed_neg' && process.steps.find(ps => ps.id === id)?.negativeOutcome.stopFlag;
  });

  // Simple logic to find next unlocked but uncompleted quests
  const nextQuests = process.steps.filter(step => {
    const s = state.steps[step.id];
    if (s && (s.status === 'completed_pos' || s.status === 'mitigated')) return false;
    
    if (!step.dependsOn || step.dependsOn.length === 0) return true;
    return step.dependsOn.every(depId => {
      const depState = state.steps[depId];
      return depState && (depState.status === 'completed_pos' || depState.status === 'mitigated');
    });
  }).slice(0, 2);

  return (
    <div className="p-4 space-y-6 pb-24 max-w-2xl mx-auto">
      
      {/* Boss Health Bar Section */}
      <section className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
          <Zap className="w-16 h-16 text-quest-gold fill-quest-gold" />
        </div>
        
        <div className="flex justify-between items-end mb-4 relative">
          <div>
            <div className="text-[10px] font-black text-quest-gold uppercase tracking-[0.3em] mb-1">Objetivo Final</div>
            <h2 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-tighter">
              <span className="text-2xl drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">🏰</span>
              {lang === 'es' ? 'Cierre Notarial' : 'Notarieller Abschluss'}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-white leading-none">{progress}%</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'es' ? 'Sincronía' : 'Fortschritt'}</div>
          </div>
        </div>

        <div className="w-full bg-slate-950 rounded-full h-5 p-1 border border-slate-800 shadow-inner">
          <div 
            className="boss-bar-glow bg-gradient-to-r from-blue-600 via-quest-info to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out relative" 
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex justify-between mt-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-quest-gold fill-quest-gold" /> Level {state.level}</span>
          <span className="text-white">{state.xp} / {state.level * 1000} XP</span>
        </div>
      </section>

      {/* Critical Risks Alert */}
      {activeRisks.length > 0 && (
        <section className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl shadow-lg ring-1 ring-rose-500/20 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 text-rose-500 font-black text-xs uppercase tracking-widest mb-3">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
            {lang === 'es' ? 'Riesgos Críticos (STOP)' : 'Kritische Risiken (STOP)'}
          </div>
          <div className="space-y-2">
            {activeRisks.map(id => {
              const step = process.steps.find(s => s.id === id);
              if (!step) return null;
              return (
                <button 
                  key={id} 
                  onClick={() => onQuestClick(step)}
                  className="w-full bg-rose-500/20 hover:bg-rose-500/30 px-3 py-2 rounded-lg text-xs font-bold text-rose-200 border border-rose-500/10 flex justify-between items-center transition-colors active:scale-[0.98]"
                >
                   {lang === 'es' ? step.title_es : step.title_de}
                   <span className="text-[8px] bg-rose-500 text-white px-1 rounded uppercase flex items-center gap-1">
                     <ArrowRight className="w-2 h-2" /> {lang === 'es' ? 'Ver Detalles' : 'Details'}
                   </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Next Quests Suggestion */}
      {nextQuests.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <div className="h-px flex-1 bg-slate-800"></div>
            {lang === 'es' ? 'Próximas Misiones' : 'Nächste Missionen'}
            <div className="h-px flex-1 bg-slate-800"></div>
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {nextQuests.map(quest => (
              <button
                key={quest.id}
                onClick={() => onQuestClick(quest)}
                className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-left hover:border-quest-info hover:bg-slate-800/80 transition-all flex justify-between items-center group active:scale-[0.99]"
              >
                <div>
                  <div className="text-[10px] text-quest-info font-black uppercase mb-1">{quest.sectionRef}</div>
                  <div className="text-sm font-bold text-white group-hover:text-quest-info transition-colors">
                    {lang === 'es' ? quest.title_es : quest.title_de}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-quest-info group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 shadow-lg group hover:border-quest-gold/50 transition-colors">
          <Trophy className="w-6 h-6 text-quest-gold mb-3 fill-quest-gold/10" />
          <div className="text-2xl font-black text-white tracking-tighter">{completedSteps} <span className="text-slate-600 text-sm">/ {totalSteps}</span></div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{lang === 'es' ? 'Quests Logradas' : 'Quests abgeschlossen'}</div>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 shadow-lg group hover:border-quest-info/50 transition-colors">
          <Shield className="w-6 h-6 text-quest-info mb-3 fill-quest-info/10" />
          <div className="text-2xl font-black text-white tracking-tighter">LVL {state.level}</div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{lang === 'es' ? 'Rango de Agente' : 'Agenten-Rang'}</div>
        </div>
      </div>

      <div className="pt-4 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-950/50 px-4 py-2 rounded-full border border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          {lang === 'es' ? 'Progreso Sincronizado Localmente' : 'Fortschritt lokal synchronisiert'}
        </div>
      </div>

    </div>
  );
};