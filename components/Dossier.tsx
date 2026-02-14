import React from 'react';
import { useGame } from '../context/GameContext';
import { Download, Upload, Trash2 } from 'lucide-react';

export const Dossier: React.FC = () => {
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
    <div className="p-4 pb-24">
      <h2 className="text-xl font-bold mb-4">{lang === 'es' ? 'Dossier / Auditoría' : 'Dossier / Audit'}</h2>
      
      {/* Actions */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-quest-info text-white rounded-lg text-sm font-bold whitespace-nowrap">
          <Download className="w-4 h-4" /> JSON Export
        </button>
        <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap">
          <Upload className="w-4 h-4" /> JSON Import
          <input type="file" accept=".json" className="hidden" onChange={handleImport} />
        </label>
        <button onClick={() => { if(confirm('Reset?')) resetGame(); }} className="flex items-center gap-2 px-4 py-2 bg-red-900 text-red-200 rounded-lg text-sm font-bold whitespace-nowrap">
          <Trash2 className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900 text-gray-400 uppercase text-xs font-bold">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">{lang === 'es' ? 'Tarea' : 'Aufgabe'}</th>
                <th className="p-3">Status</th>
                <th className="p-3">{lang === 'es' ? 'Evidencia' : 'Belege'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {process.steps.map(step => {
                const sState = state.steps[step.id];
                const statusColor = sState?.status === 'completed_pos' ? 'text-green-400' 
                  : sState?.status === 'completed_neg' ? 'text-red-400' 
                  : 'text-gray-500';
                
                return (
                  <tr key={step.id} className="hover:bg-gray-700/50">
                    <td className="p-3 font-mono text-xs text-gray-500">{step.sectionRef}</td>
                    <td className="p-3 font-medium text-gray-200">{lang === 'es' ? step.title_es : step.title_de}</td>
                    <td className={`p-3 font-bold ${statusColor}`}>
                      {sState?.status || '---'}
                    </td>
                    <td className="p-3 text-xs text-gray-400">
                      {sState?.evidence ? Object.keys(sState.evidence).filter(k => sState.evidence[k]).length : 0} / {step.evidenceRequired?.length || 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};