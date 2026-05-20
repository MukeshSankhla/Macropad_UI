import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Mode } from './types';
import { defaultMode } from './types';

// Initialize empty modes. User must load them from the device.
const initialModes: Mode[] = [];

type ConfigContextType = {
  modes: Mode[];
  setModes: (modes: Mode[]) => void;
  activeModeIndex: number;
  setActiveModeIndex: (index: number) => void;
  selectedKeyIndex: number | null; // 0-8 for keys, or null if none
  setSelectedKeyIndex: (index: number | null) => void;
  selectedEncoder: boolean;
  setSelectedEncoder: (selected: boolean) => void;
  updateMode: (index: number, mode: Mode) => void;
  addMode: (preset?: Mode) => void;
  deleteMode: (index: number) => void;
  os: 'win' | 'mac' | 'linux';
  setOs: (os: 'win' | 'mac' | 'linux') => void;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [modes, setModes] = useState<Mode[]>(initialModes);
  const [activeModeIndex, setActiveModeIndex] = useState(0);
  const [selectedKeyIndex, setSelectedKeyIndex] = useState<number | null>(null);
  const [selectedEncoder, setSelectedEncoder] = useState(false);
  const [os, setOs] = useState<'win' | 'mac' | 'linux'>('win');

  const updateMode = (index: number, mode: Mode) => {
    const newModes = [...modes];
    newModes[index] = mode;
    setModes(newModes);
  };

  const addMode = (preset?: Mode) => {
    setModes([...modes, JSON.parse(JSON.stringify(preset || defaultMode))]);
    setActiveModeIndex(modes.length);
  };

  const deleteMode = (index: number) => {
    if (modes.length <= 1) return; // Don't delete last mode
    const newModes = modes.filter((_, i) => i !== index);
    setModes(newModes);
    if (activeModeIndex >= newModes.length) {
      setActiveModeIndex(newModes.length - 1);
    }
    setSelectedKeyIndex(null);
    setSelectedEncoder(false);
  };

  return (
    <ConfigContext.Provider value={{
      modes, setModes,
      activeModeIndex, setActiveModeIndex,
      selectedKeyIndex, setSelectedKeyIndex,
      selectedEncoder, setSelectedEncoder,
      updateMode, addMode, deleteMode,
      os, setOs
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useConfig must be used within ConfigProvider");
  return context;
};
