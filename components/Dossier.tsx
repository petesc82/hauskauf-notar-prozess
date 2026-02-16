import React from 'react';
import { useGame } from '../context/GameContext';
import { Download, Upload, Trash2, Info } from 'lucide-react';
import { QuestStep } from '../types';

interface DossierProps {
  onQuestClick: (quest: QuestStep) => void;
}

export const Dossier: React.FC<DossierProps> = ({ onQuestClick }) => {
  const { state, process, importState, exportState, resetGame } = useGame();
  const lang = state.language;

  const handleExport = () => {
    const data = exportState();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quest-leon-state-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        if (importState(text)) {
          alert(lang === 'es' ? 'Importado exitosamente' : 'Erfolgreich importiert');
        } else {
          alert(lang === 'es' ? 'Error al importar' : 'Importfehler');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter">
          {lang === 'es' ? 'Dossier / Auditoría' : 'Dossier / Audit'}
        </h2>
      </div>
      
      {/* Actions */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-quest-info hover:bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors shadow-lg">
          <Download className="w-3 h-3" /> JSON Export
        </button>
        <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer whitespace-nowrap transition-colors border border-slate-700">
          <Upload className="w-3 h-3" /> JSON Import
          <input type="file" accept=".json" className="hidden" onChange={handleImport} />
        </label>
        <button onClick={() => { if(confirm('Reset game progress?')) resetGame(); }} className="flex items-center gap-2 px-4 py-2 bg-rose-900/40 hover:bg-rose-900 text-rose-200 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors border border-rose-900/30">
          <Trash2 className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Table - Mobile Optimized with clickability */}
      <div className="bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-950/80 text-slate-500 uppercase text-[9px] font-black tracking-[0.2em] border-b border-slate-800">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">{lang === 'es' ? 'Tarea' : 'Aufgabe'}</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">{lang === 'es' ? 'Evidence' : 'Belege'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {process.steps.map(step => {
                const sState = state.steps[step.id];
                const statusColor = sState?.status === 'completed_pos' ? 'text-emerald-400 bg-emerald-400/10' 
                  : sState?.status === 'completed_neg' ? 'text-rose-400 bg-rose-400/10' 
                  : sState?.status === 'mitigated' ? 'text-amber-400 bg-amber-400/10'
                  : 'text-slate-500 bg-slate-800/50';
                
                return (
                  <tr 
                    key={step.id} 
                    onClick={() => onQuestClick(step)}
                    className="hover:bg-slate-800/40 cursor-pointer active:bg-slate-800 transition-colors group"
                  >
                    <td className="p-4 font-black font-mono text-[10px] text-slate-500 group-hover:text-quest-gold transition-colors">{step.sectionRef}</td>
                    <td className="p-4 font-bold text-slate-200 group-hover:text-white transition-colors">
                      <div className="flex flex-col">
                        <span>{lang === 'es' ? step.title_es : step.title_de}</span>
                        <span className="text-[10px] font-normal text-slate-500 italic truncate max-w-[150px] md:max-w-xs">
                          {lang === 'es' ? step.description_es : step.description_de}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${statusColor}`}>
                        {sState?.status?.replace('completed_', '') || '---'}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono text-xs text-slate-400">
                      {sState?.evidence ? Object.keys(sState.evidence).filter(k => sState.evidence[k]).length : 0} / {step.evidenceRequired?.length || 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          {lang === 'es' 
            ? 'Puedes hacer clic en cualquier fila para ver los detalles de la misión, agregar notas o subir evidencia.' 
            : 'Du kannst auf jede Zeile klicken, um Missionsdetails zu sehen, Notizen hinzuzufügen oder Belege hochzuladen.'}
        </p>
      </div>
    </div>
  );
};