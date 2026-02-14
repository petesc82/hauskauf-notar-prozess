import React, { useState } from 'react';
import { QuestStep, Language, StepState } from '../types';
import { X, Save, ShieldAlert, Check, AlertOctagon } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface Props {
  step: QuestStep;
  isOpen: boolean;
  onClose: () => void;
}

export const QuestModal: React.FC<Props> = ({ step, isOpen, onClose }) => {
  const { state, updateStepStatus, updateEvidence, saveNote } = useGame();
  const stepState = state.steps[step.id] || { evidence: {}, notes: '', status: 'available' };
  const lang = state.language;
  const [noteText, setNoteText] = useState(stepState.notes);
  const [activeTab, setActiveTab] = useState<'info'|'evidence'>('info');

  if (!isOpen) return null;

  const isCompleted = stepState.status === 'completed_pos' || stepState.status === 'completed_neg';

  const handlePositive = () => {
    if (step.evidenceRequired && step.evidenceRequired.some(e => e.required && !stepState.evidence[e.code])) {
      alert(lang === 'es' ? 'Falta evidencia requerida' : 'Erforderlicher Nachweis fehlt');
      return;
    }
    updateStepStatus(step.id, 'completed_pos', 'pos');
    onClose();
  };

  const handleNegative = () => {
    updateStepStatus(step.id, 'completed_neg', 'neg');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 w-full max-w-lg sm:rounded-xl h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl border border-gray-700">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900 z-10 rounded-t-xl">
          <div>
            <span className="text-xs text-quest-gold uppercase tracking-wider font-bold">Quest {step.sectionRef}</span>
            <h2 className="text-xl font-bold text-white leading-none mt-1">
              {lang === 'es' ? step.title_es : step.title_de}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button 
            onClick={() => setActiveTab('info')}
            className={`flex-1 p-3 text-sm font-medium ${activeTab === 'info' ? 'text-quest-info border-b-2 border-quest-info' : 'text-gray-500'}`}
          >
            {lang === 'es' ? 'Misión' : 'Mission'}
          </button>
          <button 
            onClick={() => setActiveTab('evidence')}
            className={`flex-1 p-3 text-sm font-medium ${activeTab === 'evidence' ? 'text-quest-info border-b-2 border-quest-info' : 'text-gray-500'}`}
          >
            {lang === 'es' ? 'Evidencia' : 'Belege'}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <p className="text-gray-300 text-lg">
                {lang === 'es' ? step.description_es : step.description_de}
              </p>

              {step.enemy && (
                <div className="bg-red-900/20 border border-red-900/50 p-3 rounded-lg flex items-center gap-3">
                  <div className="text-3xl">{step.enemy.icon}</div>
                  <div>
                    <div className="text-xs text-red-400 uppercase font-bold">{lang === 'es' ? 'Riesgo / Enemigo' : 'Risiko / Gegner'}</div>
                    <div className="font-bold text-red-200">{step.enemy.name_es}</div>
                  </div>
                </div>
              )}

              {!isCompleted && (
                <div className="grid grid-cols-1 gap-3 pt-4">
                  <button onClick={handlePositive} className="group relative p-4 bg-green-900/30 border border-green-600/50 hover:bg-green-900/50 rounded-xl text-left transition-all">
                     <div className="flex items-center gap-2 text-green-400 font-bold mb-1">
                       <Check className="w-5 h-5" /> 
                       {lang === 'es' ? 'Éxito / Ruta Positiva' : 'Erfolg / Positiver Pfad'}
                     </div>
                     <p className="text-sm text-gray-400 group-hover:text-gray-300">
                       {lang === 'es' ? step.positiveOutcome.text_es : step.positiveOutcome.text_de}
                     </p>
                     <span className="absolute top-4 right-4 text-xs font-mono text-green-500">+{step.positiveOutcome.xp} XP</span>
                  </button>

                  <button onClick={handleNegative} className="group relative p-4 bg-red-900/30 border border-red-600/50 hover:bg-red-900/50 rounded-xl text-left transition-all">
                     <div className="flex items-center gap-2 text-red-400 font-bold mb-1">
                       <ShieldAlert className="w-5 h-5" /> 
                       {lang === 'es' ? 'Problema / Ruta Negativa' : 'Problem / Negativer Pfad'}
                     </div>
                     <p className="text-sm text-gray-400 group-hover:text-gray-300">
                       {lang === 'es' ? step.negativeOutcome.text_es : step.negativeOutcome.text_de}
                     </p>
                     {step.negativeOutcome.stopFlag && (
                       <span className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-red-500">
                         <AlertOctagon className="w-3 h-3" /> STOP
                       </span>
                     )}
                  </button>
                </div>
              )}

              {isCompleted && (
                <div className={`p-4 rounded-lg border ${stepState.status === 'completed_pos' ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`}>
                  <h4 className="font-bold mb-1">
                    {stepState.status === 'completed_pos' 
                      ? (lang === 'es' ? 'Completado: Éxito' : 'Abgeschlossen: Erfolg')
                      : (lang === 'es' ? 'Completado: Problema' : 'Abgeschlossen: Problem')
                    }
                  </h4>
                  <p className="text-sm text-gray-400">
                    {stepState.status === 'completed_pos' 
                      ? (lang === 'es' ? step.positiveOutcome.text_es : step.positiveOutcome.text_de)
                      : (lang === 'es' ? step.negativeOutcome.text_es : step.negativeOutcome.text_de)
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-4">
              {step.evidenceRequired && step.evidenceRequired.length > 0 ? (
                step.evidenceRequired.map(ev => (
                  <label key={ev.code} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750">
                    <input 
                      type="checkbox" 
                      checked={!!stepState.evidence[ev.code]} 
                      onChange={(e) => updateEvidence(step.id, ev.code, e.target.checked)}
                      className="w-5 h-5 rounded border-gray-600 text-quest-info focus:ring-quest-info bg-gray-700"
                    />
                    <div>
                      <div className="text-gray-200 font-medium">
                        {lang === 'es' ? ev.label_es : ev.label_de}
                      </div>
                      {ev.required && <div className="text-xs text-red-400 font-bold">{lang === 'es' ? 'Requerido' : 'Erforderlich'}</div>}
                    </div>
                  </label>
                ))
              ) : (
                <div className="text-gray-500 italic text-center p-4">
                  {lang === 'es' ? 'No se requiere evidencia específica.' : 'Keine spezifischen Belege erforderlich.'}
                </div>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {lang === 'es' ? 'Notas Privadas' : 'Private Notizen'}
                </label>
                <textarea 
                  className="w-full bg-gray-800 border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-quest-info focus:outline-none"
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="..."
                />
                <button 
                  onClick={() => saveNote(step.id, noteText)}
                  className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white"
                >
                  <Save className="w-3 h-3" /> {lang === 'es' ? 'Guardar Nota' : 'Notiz speichern'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};