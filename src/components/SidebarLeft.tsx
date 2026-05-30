import { useState } from 'react';
import { Plus, Trash2, GripVertical, Menu } from 'lucide-react';
import { useConfig } from '../ConfigContext';
import { presetWindowsMode, presetMacOSMode, presetLinuxMode, presetMediaMode, presetVSCodeMode, presetFusion360Mode, presetDaVinciMode, presetPhotoshopMode, presetPremiereMode } from '../types';

export const SidebarLeft = () => {
  const { modes, activeModeIndex, setActiveModeIndex, addMode, deleteMode } = useConfig();
  const [showPresetsMobile, setShowPresetsMobile] = useState(false);

  return (
    <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-zinc-200 h-auto md:h-full shrink-0 flex flex-col shadow-sm z-20">
      <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
        <h2 className="font-bold text-zinc-800 text-sm tracking-wide uppercase">Modes</h2>
        <button 
          onClick={() => addMode()}
          className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
          title="Add Mode"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {modes.map((mode, i) => (
          <div 
            key={i}
            onClick={() => setActiveModeIndex(i)}
            className={`group flex items-center p-2 rounded-lg cursor-pointer transition-all
              ${activeModeIndex === i 
                ? 'bg-blue-50 border border-blue-100 shadow-sm' 
                : 'hover:bg-zinc-50 border border-transparent'}`}
          >
            <div className="text-zinc-400 mr-2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical size={14} />
            </div>
            
            <div className="flex-1 overflow-hidden">
              <div className={`font-medium truncate text-sm ${activeModeIndex === i ? 'text-blue-700' : 'text-zinc-700'}`}>
                {mode.name}
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5 truncate uppercase tracking-wider font-semibold">
                {mode.icon} • {mode.enc_label}
              </div>
            </div>

            {modes.length > 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); deleteMode(i); }}
                className="p-1.5 text-zinc-400 hover:text-red-500 rounded hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                title="Delete Mode"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Add Preset Mode</h3>
          <button 
            onClick={() => setShowPresetsMobile(!showPresetsMobile)}
            className="md:hidden p-1 text-zinc-400 hover:text-blue-600 hover:bg-zinc-200 rounded transition-colors"
          >
            <Menu size={16} />
          </button>
        </div>
        <div className={`flex-col gap-2 ${showPresetsMobile ? 'flex' : 'hidden'} md:flex`}>
          {[
            { preset: presetWindowsMode, label: 'Windows' },
            { preset: presetMacOSMode, label: 'macOS' },
            { preset: presetLinuxMode, label: 'Linux' },
            { preset: presetMediaMode, label: 'Media' },
            { preset: presetVSCodeMode, label: 'VS Code' },
            { preset: presetFusion360Mode, label: 'Fusion 360' },
            { preset: presetDaVinciMode, label: 'DaVinci Resolve' },
            { preset: presetPhotoshopMode, label: 'Photoshop' },
            { preset: presetPremiereMode, label: 'Premiere Pro' },
          ].map(({ preset, label }) => {
            const exists = modes.some(m => m.name === preset.name);
            return (
              <button
                key={label}
                onClick={() => !exists && addMode(preset)}
                disabled={exists}
                className={`text-xs text-left px-3 py-2 border rounded shadow-sm transition-all font-medium ${
                  exists 
                    ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed' 
                    : 'bg-white border-zinc-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
                }`}
              >
                {label} {exists && '(Added)'}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
