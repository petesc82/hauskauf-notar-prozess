import React, { createContext, useContext, useEffect, useState } from 'react';
import { GameState, INITIAL_STATE, Language, StepStatus, QuestStep } from '../types';
import { PROCESS_DATA } from '../data/process';

interface GameContextType {
  state: GameState;
  process: { steps: QuestStep[] };
  setLanguage: (lang: Language) => void;
  updateStepStatus: (stepId: string, status: StepStatus, chosenPath: 'pos' | 'neg') => void;
  updateEvidence: (stepId: string, evidenceCode: string, checked: boolean) => void;
  saveNote: (stepId: string, note: string) => void;
  resetGame: () => void;
  importState: (json: string) => boolean;
  exportState: () => string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('quest_leon_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
      } catch (e) {
        console.error('Failed to load state', e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('quest_leon_state', JSON.stringify(state));
  }, [state]);

  const setLanguage = (lang: Language) => {
    setState(prev => ({ ...prev, language: lang }));
  };

  const updateStepStatus = (stepId: string, status: StepStatus, chosenPath: 'pos' | 'neg') => {
    const stepDef = PROCESS_DATA.steps.find(s => s.id === stepId) as QuestStep;
    if (!stepDef) return;

    let xpGain = 0;
    if (status === 'completed_pos') xpGain = stepDef.positiveOutcome.xp;
    if (status === 'completed_neg') xpGain = stepDef.negativeOutcome.xp;
    
    // Prevent double XP if already completed
    const existingStatus = state.steps[stepId]?.status;
    if (existingStatus === 'completed_pos' || existingStatus === 'completed_neg') {
      xpGain = 0;
    }

    setState(prev => {
      const newState = { ...prev };
      newState.steps[stepId] = {
        ...newState.steps[stepId],
        status,
        chosenPath,
        date: new Date().toISOString()
      };
      newState.xp += xpGain;
      newState.level = Math.floor(newState.xp / 1000) + 1;
      return newState;
    });
  };

  const updateEvidence = (stepId: string, evidenceCode: string, checked: boolean) => {
    setState(prev => ({
      ...prev,
      steps: {
        ...prev.steps,
        [stepId]: {
          ...prev.steps[stepId],
          evidence: {
            ...(prev.steps[stepId]?.evidence || {}),
            [evidenceCode]: checked
          }
        }
      }
    }));
  };

  const saveNote = (stepId: string, note: string) => {
    setState(prev => ({
      ...prev,
      steps: {
        ...prev.steps,
        [stepId]: {
          ...prev.steps[stepId],
          notes: note
        }
      }
    }));
  };

  const resetGame = () => setState(INITIAL_STATE);

  const importState = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      // Basic validation
      if (!parsed.version || !parsed.steps) return false;
      setState(parsed);
      return true;
    } catch (e) {
      return false;
    }
  };

  const exportState = () => JSON.stringify(state, null, 2);

  return (
    <GameContext.Provider value={{
      state,
      process: PROCESS_DATA as { steps: QuestStep[] },
      setLanguage,
      updateStepStatus,
      updateEvidence,
      saveNote,
      resetGame,
      importState,
      exportState
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};