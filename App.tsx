import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Dashboard } from './components/Dashboard';
import { QuestCard } from './components/QuestCard';
import { QuestModal } from './components/QuestModal';
import { Dossier } from './components/Dossier';
import { LayoutDashboard, Map, FileText, Settings, Globe } from 'lucide-react';
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

  // Helper to check if a quest is unlocked
  const isQuestUnlocked = (step: QuestStep) => {
    // If it's a mitigation quest, check logic (simplified: always show but might be locked by logic elsewhere, 
    // but for this MVP we show all gate steps. DependsOn handles lock)
    if (!step.dependsOn || step.dependsOn.length === 0) {
      // If it has no dependencies, it's unlocked if it's in Gate 0 OR previous gate is mostly done.
      // For MVP simplicity: Unlock Gate N if Gate N-1 has at least 1 completed step or logic
      if (step.gate === 0) return true;
      // Simple logic: Allow viewing all, but visually lock if hard dependency not met
      return true;
    }
    // Check dependencies
    return step.dependsOn.every(depId => {
      const s = state.steps[depId];
      return s && (s.status === 'completed_pos' || s.status === 'mitigated');
    });
  };

  const stepsInGate = process.steps.filter(s => s.gate === activeGate);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      
      {/* Top Bar */}
      <header className="flex-none bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center z-20">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Map className="text-quest-gold" />
          Quest León
        </h1>
        <button onClick={toggleLang} className="flex items-center gap-1 text-xs font-bold bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 border border-gray-600">
          <Globe className="w-3 h-3" />
          {lang === 'es' ? 'ES' : 'DE'}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {view === 'dashboard' && <Dashboard />}
        
        {view === 'dossier' && <Dossier />}

        {view === 'gates' && (
          <div className="pb-24">
            {/* Gate Tabs */}
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur z-10 border-b border-gray-700 flex overflow-x-auto">
              {[0, 1, 2, 3].map((gate) => (
                <button
                  key={gate}
                  onClick={() => setActiveGate(gate as GateLevel)}
                  className={`flex-none px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                    activeGate === gate 
                      ? 'border-quest-gold text-quest-gold' 
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Gate {gate}
                </button>
              ))}
            </div>

            <div className="p-4">
              <div className="mb-4 text-xs text-gray-400 uppercase tracking-widest font-bold">
                {lang === 'es' ? `Misiones de Fase ${activeGate}` : `Phase ${activeGate} Missionen`}
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

              {stepsInGate.length === 0 && (
                <div className="text-center p-8 text-gray-500">
                  No quests in this gate yet.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="flex-none bg-gray-800 border-t border-gray-700 pb-safe">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => setView('dashboard')}
            className={`flex flex-col items-center gap-1 p-2 ${view === 'dashboard' ? 'text-quest-gold' : 'text-gray-500'}`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          
          <button 
            onClick={() => setView('gates')}
            className={`flex flex-col items-center gap-1 p-2 ${view === 'gates' ? 'text-quest-gold' : 'text-gray-500'}`}
          >
            <Map className="w-6 h-6" />
            <span className="text-[10px] font-bold">Quests</span>
          </button>

          <button 
            onClick={() => setView('dossier')}
            className={`flex flex-col items-center gap-1 p-2 ${view === 'dossier' ? 'text-quest-gold' : 'text-gray-500'}`}
          >
            <FileText className="w-6 h-6" />
            <span className="text-[10px] font-bold">Dossier</span>
          </button>
        </div>
      </nav>

      {/* Detail Modal */}
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