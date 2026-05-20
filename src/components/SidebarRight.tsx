import React from 'react';
import { useConfig } from '../ConfigContext';
import type { KeyAction, EncoderAction } from '../types';
import { KEYCODES, CONSUMER_CONTROL_CODES } from '../keycodes';

export const SidebarRight = () => {
  const { modes, activeModeIndex, updateMode, selectedKeyIndex, selectedEncoder, os } = useConfig();
  const currentMode = modes[activeModeIndex];
  const [isKeyboardMappingEnabled, setIsKeyboardMappingEnabled] = React.useState(false);

  const getOsKeyName = (key: string, os: 'win' | 'mac' | 'linux') => {
    if (key === 'GUI') {
      if (os === 'mac') return 'CMD';
      if (os === 'linux') return 'SUPER';
      return 'WIN';
    }
    if (key === 'ALT') {
      if (os === 'mac') return 'OPT';
    }
    return key;
  };

  const handleModeChange = (field: keyof typeof currentMode, value: any) => {
    updateMode(activeModeIndex, { ...currentMode, [field]: value });
  };

  const handleKeyUpdate = (index: number, updates: Partial<KeyAction>) => {
    const newKeys = [...currentMode.keys];
    newKeys[index] = { ...newKeys[index], ...updates };
    handleModeChange('keys', newKeys);
  };

  const handleEncoderUpdate = (direction: 'enc_cw' | 'enc_ccw' | 'enc_press' | 'enc_double', updates: Partial<EncoderAction>) => {
    const enc = currentMode[direction] || { action_type: 'none', action_value: '' };
    handleModeChange(direction, { ...enc, ...updates });
  };

  const toggleKeycode = (index: number, code: string) => {
    const currentActionValue = currentMode.keys[index].action_value;
    // ensure it's an array (fallback for old state format)
    const currentArray = Array.isArray(currentActionValue) ? currentActionValue : [];

    if (currentArray.includes(code)) {
      handleKeyUpdate(index, { action_value: currentArray.filter(c => c !== code) });
    } else {
      handleKeyUpdate(index, { action_value: [...currentArray, code] });
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isKeyboardMappingEnabled) return;

      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (selectedKeyIndex !== null && currentMode?.keys[selectedKeyIndex]?.action_type === 'shortcut') {
        let codeToToggle = '';
        const key = e.key.toUpperCase();
        
        if (key === 'CONTROL') codeToToggle = 'CONTROL';
        else if (key === 'SHIFT') codeToToggle = 'SHIFT';
        else if (key === 'ALT') codeToToggle = 'ALT';
        else if (key === 'META' || key === 'OS') codeToToggle = 'GUI';
        else if (key === ' ') codeToToggle = 'SPACE';
        else if (key === 'ENTER') codeToToggle = 'ENTER';
        else if (key === 'BACKSPACE') codeToToggle = 'BACKSPACE';
        else if (key === 'ESCAPE') codeToToggle = 'ESCAPE';
        else if (key === 'TAB') codeToToggle = 'TAB';
        else if (key === 'ARROWUP') codeToToggle = 'UP_ARROW';
        else if (key === 'ARROWDOWN') codeToToggle = 'DOWN_ARROW';
        else if (key === 'ARROWLEFT') codeToToggle = 'LEFT_ARROW';
        else if (key === 'ARROWRIGHT') codeToToggle = 'RIGHT_ARROW';
        else if (/^[A-Z]$/.test(key)) codeToToggle = key;
        else if (/^[0-9]$/.test(key)) {
           const nums = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
           codeToToggle = nums[parseInt(key)];
        }
        else if (/^F([1-9]|1[0-2])$/.test(key)) codeToToggle = key;

        if (codeToToggle && KEYCODES.includes(codeToToggle)) {
          e.preventDefault();
          toggleKeycode(selectedKeyIndex, codeToToggle);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedKeyIndex, currentMode, toggleKeycode]);


  return (
    <div className="w-80 bg-white border-l border-zinc-200 h-full flex flex-col shadow-sm z-20 overflow-y-auto">
      <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
        <h2 className="font-bold text-zinc-800 text-sm tracking-wide uppercase">Properties</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
        {!currentMode && (
          <div className="flex flex-col items-center justify-center h-48 text-zinc-400 text-center px-4">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <p className="text-sm font-medium">No Config Loaded</p>
            <p className="text-xs mt-1">Select a configuration folder first.</p>
          </div>
        )}

        {currentMode && (
          <>
            {/* Mode Settings */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Mode Settings</h3>

              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">Mode Name</label>
                <input
                  type="text"
                  value={currentMode.name}
                  onChange={(e) => handleModeChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-zinc-600 mb-1">OLED Icon (Max 4)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={currentMode.icon}
                    onChange={(e) => handleModeChange('icon', e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all uppercase"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-zinc-600 mb-1">Encoder Lbl</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={currentMode.enc_label}
                    onChange={(e) => handleModeChange('enc_label', e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all uppercase"
                  />
                </div>
              </div>
            </div>

            <hr className="border-zinc-100" />


        {/* Selected Key Settings */}
        {selectedKeyIndex !== null && (
          <div className="space-y-4 mt-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Key {selectedKeyIndex + 1} Action</h3>
              <span className="text-[10px] font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Editing</span>
            </div>

            <div className="flex gap-3">
              <div className="w-1/3">
                <label className="block text-xs font-medium text-zinc-600 mb-1">OLED Lbl</label>
                <input
                  type="text"
                  maxLength={4}
                  value={currentMode.keys[selectedKeyIndex].short_label}
                  onChange={(e) => handleKeyUpdate(selectedKeyIndex, { short_label: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase"
                />
              </div>
              <div className="w-2/3">
                <label className="block text-xs font-medium text-zinc-600 mb-1">Description</label>
                <input
                  type="text"
                  value={currentMode.keys[selectedKeyIndex].label}
                  onChange={(e) => handleKeyUpdate(selectedKeyIndex, { label: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Action Type</label>
              <select
                value={currentMode.keys[selectedKeyIndex].action_type}
                onChange={(e) => {
                  handleKeyUpdate(selectedKeyIndex, {
                    action_type: e.target.value as KeyAction['action_type'],
                    action_value: []
                  });
                }}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="shortcut">Keyboard Shortcut</option>
                <option value="media">Media Control</option>
                <option value="none">None</option>
              </select>
            </div>

            {currentMode.keys[selectedKeyIndex].action_type === 'shortcut' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-zinc-600">Select Keys (Multi-select)</label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={isKeyboardMappingEnabled}
                      onChange={(e) => setIsKeyboardMappingEnabled(e.target.checked)}
                    />
                    <div className="w-6 h-3.5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-blue-500 relative"></div>
                    <span className="text-[9px] font-medium text-zinc-500 group-hover:text-zinc-700">Physical KB Map</span>
                  </label>
                </div>

                {/* Visual indicator of selected keys */}
                <div className="flex flex-wrap gap-1 mb-3 min-h-[32px] p-2 bg-blue-50 border border-blue-100 rounded-lg">
                  {Array.isArray(currentMode.keys[selectedKeyIndex].action_value) &&
                    currentMode.keys[selectedKeyIndex].action_value.length > 0 ? (
                    (currentMode.keys[selectedKeyIndex].action_value as string[]).map(key => (
                      <span key={key} className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded font-semibold tracking-wide flex items-center gap-1">
                        {getOsKeyName(key, os)}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleKeycode(selectedKeyIndex, key); }}
                          className="hover:text-red-200 ml-1"
                        >×</button>
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-blue-300 italic">No keys selected (Press a key on your keyboard to assign)</span>
                  )}
                </div>

                <div className="h-68 overflow-y-auto border border-zinc-200 rounded-lg p-2 grid grid-cols-3 gap-2 bg-zinc-50">
                  {KEYCODES.map(code => {
                    const isSelected = Array.isArray(currentMode.keys[selectedKeyIndex].action_value)
                      ? (currentMode.keys[selectedKeyIndex].action_value as string[]).includes(code)
                      : false;
                    return (
                      <button
                        key={code}
                        onClick={() => toggleKeycode(selectedKeyIndex, code)}
                        className={`text-[11px] leading-tight px-2 py-2 rounded font-medium text-left truncate transition-colors
                          ${isSelected ? 'bg-blue-500 text-white shadow-sm' : 'hover:bg-zinc-200 text-zinc-700'}`}
                        title={code}
                      >
                        {getOsKeyName(code, os)}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {currentMode.keys[selectedKeyIndex].action_type === 'media' && (
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">Select Media Action</label>
                <select
                  value={Array.isArray(currentMode.keys[selectedKeyIndex].action_value) ? currentMode.keys[selectedKeyIndex].action_value[0] || '' : ''}
                  onChange={(e) => handleKeyUpdate(selectedKeyIndex, { action_value: [e.target.value] })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="">-- Select Action --</option>
                  {CONSUMER_CONTROL_CODES.map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>
            )}

          </div>
        )}

        {/* Selected Encoder Settings */}
        {selectedEncoder && (
          <div className="space-y-4 mt-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wider">Encoder Actions</h3>
              <span className="text-[10px] font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Editing</span>
            </div>

            {['enc_cw', 'enc_ccw'].map((dir) => {
              const encoderDir = dir as 'enc_cw' | 'enc_ccw';
              const label = dir === 'enc_cw' ? 'Clockwise (CW)' : 'Counter-Clockwise (CCW)';

              return (
                <div key={dir} className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 space-y-3">
                  <h4 className="text-xs font-medium text-zinc-800">{label}</h4>
                  <div className="space-y-2">
                    <select
                      value={currentMode[encoderDir].action_type}
                      onChange={(e) => {
                        handleEncoderUpdate(encoderDir, {
                          action_type: e.target.value as EncoderAction['action_type'],
                          action_value: ''
                        });
                      }}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="shortcut">Shortcut (Select below)</option>
                      <option value="media">Media Control</option>
                      <option value="mouse">Mouse</option>
                      <option value="none">None</option>
                    </select>

                    {currentMode[encoderDir].action_type === 'shortcut' && (
                      <select
                        value={currentMode[encoderDir].action_value as string}
                        onChange={(e) => handleEncoderUpdate(encoderDir, { action_value: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="">-- Select Keycode --</option>
                        {KEYCODES.map(c => <option key={c} value={c}>{getOsKeyName(c, os)}</option>)}
                      </select>
                    )}

                    {currentMode[encoderDir].action_type === 'media' && (
                      <select
                        value={currentMode[encoderDir].action_value as string}
                        onChange={(e) => handleEncoderUpdate(encoderDir, { action_value: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="">-- Select Action --</option>
                        {CONSUMER_CONTROL_CODES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    )}

                    {currentMode[encoderDir].action_type === 'mouse' && (
                      <input
                        type="text"
                        placeholder="Mouse Scroll Value (e.g. 3 or -3)"
                        value={currentMode[encoderDir].action_value as string}
                        onChange={(e) => handleEncoderUpdate(encoderDir, { action_value: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {selectedKeyIndex === null && !selectedEncoder && (
          <div className="flex flex-col items-center justify-center h-48 text-zinc-400 text-center px-4">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <p className="text-sm font-medium">No Element Selected</p>
            <p className="text-xs mt-1">Click a key or the encoder on the macropad to edit its properties.</p>
          </div>
        )}

          </>
        )}
      </div>
    </div>
  );
};
