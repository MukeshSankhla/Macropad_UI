import React, { useState, useRef } from 'react';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { Macropad } from './components/Macropad';
import { useConfig, ConfigProvider } from './ConfigContext';
import { fsManager } from './fsManager';
import { Upload, Download, RefreshCw, Usb, HelpCircle, X, FileText } from 'lucide-react';

function AppContent() {
  const { modes, setModes, os, setOs } = useConfig();
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [directoryName, setDirectoryName] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConnect = async () => {
    if (isConnected) {
      await fsManager.disconnect();
      setIsConnected(false);
      setDirectoryName("");
    } else {
      const success = await fsManager.connect();
      if (success) {
        setIsConnected(true);
        setDirectoryName(fsManager.getDirectoryName());
        await handleReadFromDevice();
      }
    }
  };

  const handleReadFromDevice = async () => {
    if (!fsManager.isConnected()) return;
    setIsSyncing(true);
    try {
      const content = await fsManager.readModesFile();
      if (content) {
        // Strip "MODES = " prefix to get JSON
        let jsonStr = content.trim();
        if (jsonStr.startsWith("MODES = ")) {
          jsonStr = jsonStr.substring(8).trim();
        }
        try {
          const parsed = JSON.parse(jsonStr);
          if (Array.isArray(parsed)) {
            setModes(parsed);
          }
        } catch (e) {
          console.error("Failed to parse modes.py", e);
        }
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncToDevice = async () => {
    if (!fsManager.isConnected()) {
      alert("Please connect to the Macropad folder first.");
      return;
    }
    setIsSyncing(true);
    try {
      const jsonContent = JSON.stringify(modes, null, 2);
      const pythonContent = `MODES = ${jsonContent}\n`;
      const success = await fsManager.writeModesFile(pythonContent);
      if (success) {
        alert("Synced modes.py to device successfully! CircuitPython will auto-reload.");
      } else {
        alert("Error syncing to device");
      }
    } catch (e) {
      console.error("Failed to write to device", e);
      alert("Error syncing to device");
    } finally {
      setIsSyncing(false);
    }
  };

  const exportConfig = () => {
    const data = JSON.stringify(modes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modes.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          setModes(parsed);
          alert("Profile imported successfully!");
        } else {
          alert("Invalid profile format.");
        }
      } catch (err) {
        alert("Failed to parse JSON.");
        console.error(err);
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="h-screen w-full flex flex-col bg-zinc-100 overflow-hidden text-zinc-900 font-sans">

      {/* Top Navigation Bar */}
      <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
          <h1 className="text-2xl font-bold tracking-wider text-gray-500" style={{ fontFamily: "'Lulu', cursive" }}>MACROPAD</h1>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://www.instructables.com/MACROPAD/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold text-white transition-all bg-gradient-to-r from-gray-500 to-gray-500 hover:from-green-600 hover:to-green-600 shadow-md hover:shadow-lg"
          >
            <FileText size={16} className="text-white" />
            Build Your Own <span style={{ fontFamily: "'Lulu', cursive", letterSpacing: "1px" }}>MACROPAD</span>
          </a>

          <div className="w-px h-6 bg-zinc-300 hidden md:block"></div>

          <div className="flex items-center gap-2 bg-zinc-100 rounded-lg p-1">
            <button onClick={exportConfig} className="p-1.5 text-zinc-600 hover:text-blue-600 hover:bg-white rounded transition-colors" title="Export Profile">
              <Download size={18} />
            </button>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              className="hidden"
              onChange={importConfig}
            />
            <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-zinc-600 hover:text-blue-600 hover:bg-white rounded transition-colors" title="Import Profile">
              <Upload size={18} />
            </button>
          </div>

          <div className="w-px h-6 bg-zinc-300"></div>

          <select
            value={os}
            onChange={(e) => setOs(e.target.value as 'win' | 'mac' | 'linux')}
            className="text-sm bg-zinc-100 border border-zinc-200 rounded py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer text-zinc-700 font-medium"
          >
            <option value="win">Windows</option>
            <option value="mac">Mac</option>
            <option value="linux">Linux</option>
          </select>

          <div className="w-px h-6 bg-zinc-300"></div>

          <div className={`flex items-center rounded-full transition-colors ${isConnected ? 'bg-green-100 text-green-700' : 'bg-zinc-800 text-white'}`}>
            <button
              onClick={handleConnect}
              className={`flex items-center gap-2 pl-4 pr-3 py-1.5 rounded-l-full text-sm font-semibold hover:bg-black/10 transition-colors`}
            >
              <Usb size={16} />
              {isConnected ? `Connected: ${directoryName}` : 'Connect'}
            </button>
            <div className={`w-px h-4 ${isConnected ? 'bg-green-700/20' : 'bg-white/20'}`}></div>
            <button
              onClick={() => setShowHelp(true)}
              className={`p-1.5 pr-3 pl-2.5 hover:bg-black/10 rounded-r-full transition-colors`}
              title="How to connect"
            >
              <HelpCircle size={18} />
            </button>
          </div>

          <button
            onClick={handleSyncToDevice}
            disabled={!isConnected || isSyncing}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all
              ${!isConnected
                ? 'opacity-50 cursor-not-allowed bg-blue-100 text-blue-400'
                : isSyncing
                  ? 'bg-blue-200 text-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
          >
            <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
            Sync to Device
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        <SidebarLeft />
        <div className="flex-1 flex items-center justify-center p-6 relative">
          <Macropad />
        </div>
        <SidebarRight />
      </main>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-50">
              <h2 className="font-bold text-zinc-800">How to Connect Macropad</h2>
              <button onClick={() => setShowHelp(false)} className="p-1 text-zinc-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm text-zinc-600">
              <p>To configure your Macropad, follow these steps:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Plug your Macropad into your computer using a USB cable.</li>
                <li>Wait for it to appear as a USB drive (usually named <strong>CIRCUITPY</strong>).</li>
                <li>Click the <strong>Connect</strong> button in the top right corner.</li>
                <li>Your browser will ask you to select a folder. Select the <strong>CIRCUITPY</strong> drive.</li>
                <li>Click <strong>View files</strong> to grant access. The app will load your existing configuration automatically.</li>
              </ol>
              <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                Note: You must use a browser that supports the File System Access API (like Chrome, Edge, or Opera).
              </div>
            </div>
            <div className="p-4 border-t border-zinc-100 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="h-10 bg-white border-t border-zinc-200 flex items-center justify-between px-6 z-30 text-xs text-zinc-500 shadow-[0_-1px_2px_rgba(0,0,0,0.02)] shrink-0">
        <div>
          &copy; 2026 <a href="https://www.makerbrains.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Maker Brains</a>. All rights reserved. | contact: <a href="mailto:mukeshdiy1@gmail.com" className="hover:text-blue-600 transition-colors">mukeshdiy1@gmail.com</a>
        </div>
        <div>
          Made with <span className="text-red-500">❤️</span> by <a href="https://www.linkedin.com/in/mukeshsankhla/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Mukesh Sankhla</a>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <AppContent />
    </ConfigProvider>
  );
}
