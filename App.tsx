import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Dashboard } from './components/Dashboard';
import { QuestCard } from './components/QuestCard';
import { QuestModal } from './components/QuestModal';
import { Dossier } from './components/Dossier';
import { LayoutDashboard, Map, FileText, Globe } from 'lucide-react';
import { QuestStep, GateLevel } from './types';

const AppContent: React.FC = () => {
  const { state, process, setLanguage } = useGame();
  const [view, setView] = useState<'dashboard' | 'gates' | 'dossier'>('dashboard');
  const [activeGate, setActiveGate] = useState<GateLevel>(0);
  const [selectedQuest, setSelectedQuest] = useState<QuestStep | null>(null);

  const lang = state.language;

  const toggleLang = () => {
    setLanguage(lang === 'es' ? 'de' : 'es');
  };

  const isQuestUnlocked = (step: QuestStep) => {
    if (!step.dependsOn || step.dependsOn.length === 0) {
      return true;
    }
    return step.dependsOn.every(depId => {
      const s = state.steps[depId];
      return s && (s.status === 'completed_pos' || s.status === 'mitigated');
    });
  };

  const stepsInGate = process.steps.filter(s => s.gate === activeGate);

  return (
    <div className="flex flex-col h-screen bg-[#0b1120] text-slate-50 font-sans selection:bg-quest-gold/30">
      
      {/* Header - Transparent Glass Effect */}
      <header className="flex-none bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 flex justify-between items-center z-20">
        <h1 className="text-xl font-black tracking-tighter text-white flex items-center gap-2">
          <Map className="text-quest-gold w-6 h-6 fill-quest-gold/20" />
          QUEST LEÓN
        </h1>
        <button 
          onClick={toggleLang} 
          className="flex items-center gap-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-full border border-slate-700 transition-all active:scale-95 shadow-lg"
        >
          <Globe className="w-3.5 h-3.5 text-quest-gold" />
          {lang === 'es' ? 'ESPAÑOL' : 'DEUTSCH'}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {view === 'dashboard' && <Dashboard onQuestClick={setSelectedQuest} />}
        {view === 'dossier' && <Dossier onQuestClick={setSelectedQuest} />}
        {view === 'gates' && (
          <div className="pb-24">
            {/* Gate Tabs */}
            <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md z-10 border-b border-slate-800 flex overflow-x-auto no-scrollbar">
              {[0, 1, 2, 3].map((gate) => (
                <button
                  key={gate}
                  onClick={() => setActiveGate(gate as GateLevel)}
                  className={`flex-1 min-w-[80px] px-4 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
                    activeGate === gate 
                      ? 'border-quest-gold text-quest-gold bg-quest-gold/5' 
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Gate {gate}
                </button>
              ))}
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-slate-800"></div>
                <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">
                  {lang === 'es' ? `Fase ${activeGate}` : `Phase ${activeGate}`}
                </div>
                <div className="h-px flex-1 bg-slate-800"></div>
              </div>
              
              {stepsInGate.map(step => (
                <QuestCard
                  key={step.id}
                  step={step}
                  lang={lang}
                  status={state.steps[step.id]?.status}
                  isAvailable={isQuestUnlocked(step)}
                  onClick={() => setSelectedQuest(step)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Navigation - Bottom bar */}
      <nav className="flex-none bg-slate-900 border-t border-slate-800 safe-area-bottom">
        <div className="flex justify-around items-center h-20 px-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'HUB' },
            { id: 'gates', icon: Map, label: 'QUESTS' },
            { id: 'dossier', icon: FileText, label: 'DOSSIER' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
                view === item.id ? 'text-quest-gold scale-110' : 'text-slate-500 opacity-60'
              }`}
            >
              <item.icon className={`w-6 h-6 ${view === item.id ? 'fill-quest-gold/20' : ''}`} />
              <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
              {view === item.id && <div className="w-1 h-1 rounded-full bg-quest-gold mt-1 animate-pulse" />}
            </button>
          ))}
        </div>
      </nav>

      {selectedQuest && (
        <QuestModal 
          step={selectedQuest} 
          isOpen={!!selectedQuest} 
          onClose={() => setSelectedQuest(null)} 
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;