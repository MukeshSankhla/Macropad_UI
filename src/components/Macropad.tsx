import React from 'react';
import { motion } from 'framer-motion';
import { useConfig } from '../ConfigContext';

export const Macropad = () => {
  const { modes, activeModeIndex, selectedKeyIndex, setSelectedKeyIndex, selectedEncoder, setSelectedEncoder } = useConfig();
  const currentMode = modes[activeModeIndex];

  return (
    <div className="flex flex-col items-center justify-center p-8 h-full relative">
      {/* Decorative ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1.4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative z-10 origin-center"
      >
        {/* 3D Offset Base Layer */}
        <div className="absolute w-full h-full top-5 left-5 bg-zinc-300 rounded-[1.2rem] shadow-2xl"></div>

        {/* Main Top Layer */}
        <div className="glass-panel p-6 rounded-[1.2rem] macropad-shadow flex flex-col items-center gap-4 relative z-20">
          <div className="flex gap-4 items-center mb-2">
            {/* OLED Screen */}
            <div className={`w-32 h-16 rounded-lg border-[3px] border-zinc-800 flex flex-col shadow-2xl relative overflow-hidden ${!currentMode ? 'bg-white' : 'bg-black'}`}>
              {/* OLED scanlines effect */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJub25lIi8+CjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPgo8L3N2Zz4=')] opacity-30 pointer-events-none z-0"></div>

              {!currentMode ? (
                <div className="flex flex-col items-center justify-center h-full text-black z-10">
                  <span className="font-bold text-[12px] tracking-widest mt-0.5">MACROPAD</span>
                  <span className="font-semibold text-[8px] mt-0.6">www.makerbrains.com</span>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col z-10">
                  {/* Top Bar (Full Width) */}
                  <div className="h-[14px] bg-white text-black flex justify-between items-center px-1">
                    <span className="font-bold text-[7px] tracking-widest truncate">{currentMode.name?.toUpperCase() || 'NO MODES'}</span>
                    <span className="font-bold text-[7px] ml-1">{currentMode.icon || '---'}</span>
                  </div>

                  {/* Bottom Area: Grid + Side Bar */}
                  <div className="flex-1 flex">
                    {/* 3x3 Grid */}
                    <div className="flex-1 grid grid-cols-3 grid-rows-3 gap-[1px] bg-zinc-700">
                      {Array(9).fill(null).map((_, i) => {
                        const key = currentMode.keys?.[i];
                        return (
                          <div key={i} className="bg-black text-white text-[6px] flex items-center pl-1 overflow-hidden">
                            <span className="opacity-80 mr-1 font-bold text-[7px]">{i + 1}</span>
                            <span className="truncate font-semibold text-[7px]">{key?.short_label || ''}</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Side Bar */}
                    <div className="w-[14px] bg-white flex flex-col items-center justify-center">
                      {(currentMode.enc_label || 'NONE').split('').slice(0, 4).map((char, i) => (
                        <span key={i} className="text-black font-bold text-[7px] leading-none my-[0.5px]">{char}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <motion.div
                onClick={() => { if (currentMode) { setSelectedEncoder(true); setSelectedKeyIndex(null); } }}
                whileHover={currentMode ? { scale: 1.05 } : { scale: 1.05 }}
                whileTap={currentMode ? { scale: 0.95 } : {}}
                className={`w-20 h-20 rounded-full flex items-center justify-center overflow-hidden ${!currentMode ? 'cursor-not-allowed' : 'cursor-pointer'} transition-colors relative
                ${selectedEncoder
                    ? 'shadow-[0_0_20px_rgba(220,38,38,0.5)] bg-red-800'
                    : 'shadow-2xl bg-red-800'}
               `}
              >
                {/* 24 Grip Dots (Indentations) */}
                {Array(24).fill(null).map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 flex items-start justify-center pointer-events-none"
                    style={{ transform: `rotate(${i * 15}deg)` }}
                  >
                    <div className="w-[6px] h-[6px] rounded-full bg-zinc-100 -mt-[5px] shadow-inner opacity-90"></div>
                  </div>
                ))}

                {/* Encoder texture */}
                <div className="w-16 h-16 bg-red-700 rounded-full shadow-inner flex items-center justify-center z-10">
                  <div className="w-12 h-12 border-2 border-red-800/50 rounded-full border-dashed opacity-30"></div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Input Area - 3x3 Grid */}
          <div className="grid grid-cols-3 gap-3 p-3">
            {Array(9).fill(null).map((_, i) => {
              return (
                <motion.button
                  key={i}
                  whileHover={{ y: -1 }}
                  whileTap={currentMode ? { y: 3, scale: 0.98 } : {}}
                  onClick={() => { if (currentMode) { setSelectedKeyIndex(i); setSelectedEncoder(false); } }}
                  className={`relative w-16 h-16 outline-none focus:outline-none group ${!currentMode ? 'cursor-not-allowed' : ''}`}
                >
                  {/* Keycap Base (Skirt) */}
                  <div className={`absolute inset-0 rounded-xl shadow-md transition-colors
                    ${selectedKeyIndex === i && currentMode ? 'bg-blue-700' : 'bg-zinc-400 group-hover:bg-zinc-300'}`}
                  ></div>

                  {/* Keycap Top Surface */}
                  <div className={`absolute left-1.5 right-1.5 top-1 bottom-2.5 rounded-lg flex items-center justify-center font-bold text-sm shadow-inner transition-colors
                    ${selectedKeyIndex === i && currentMode
                      ? 'bg-blue-500 text-white border-t border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]'
                      : 'bg-zinc-200 text-zinc-700 border-t border-zinc-100 group-hover:bg-zinc-100'}`}
                  >
                    K{i + 1}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
