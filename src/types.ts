export type KeyAction = {
  short_label: string; // Up to 4 chars for OLED
  label: string;
  action_type: 'shortcut' | 'media' | 'macro' | 'none';
  action_value: string[]; // Array of strings e.g., ['GUI', 'D']
};

export type EncoderAction = {
  action_type: 'shortcut' | 'media' | 'mouse' | 'none';
  action_value: string;
};

export type Mode = {
  name: string;
  icon: string; // Up to 4 chars
  enc_label: string;
  enc_cw: EncoderAction;
  enc_ccw: EncoderAction;
  enc_press?: EncoderAction; // Optional if we want to customize press later
  enc_double?: EncoderAction;
  keys: KeyAction[]; // Array of exactly 9 keys
};

export const defaultMode: Mode = {
  name: 'New Mode',
  icon: 'NEW',
  enc_label: 'VOL',
  enc_cw: { action_type: 'media', action_value: 'VOLUME_INCREMENT' },
  enc_ccw: { action_type: 'media', action_value: 'VOLUME_DECREMENT' },
  keys: Array(9).fill({
    short_label: 'BTN',
    label: 'Button',
    action_type: 'none',
    action_value: []
  })
};

export const presetWindowsMode: Mode = {
  name: 'Windows',
  icon: 'WIN',
  enc_label: 'BRIGH',
  enc_cw: { action_type: 'media', action_value: 'BRIGHTNESS_INCREMENT' },
  enc_ccw: { action_type: 'media', action_value: 'BRIGHTNESS_DECREMENT' },
  keys: [
    { short_label: 'DSK', label: 'Desktop Show', action_type: 'shortcut', action_value: ['GUI', 'D'] },
    { short_label: 'LOCK', label: 'Lock PC', action_type: 'shortcut', action_value: ['GUI', 'L'] },
    { short_label: 'SNAP', label: 'Screenshot Tool', action_type: 'shortcut', action_value: ['GUI', 'SHIFT', 'S'] },
    { short_label: 'EMOJ', label: 'Emoji Panel', action_type: 'shortcut', action_value: ['GUI', 'PERIOD'] },
    { short_label: 'CLIP', label: 'Clipboard History', action_type: 'shortcut', action_value: ['GUI', 'V'] },
    { short_label: 'LEFT', label: 'Snap Window Left', action_type: 'shortcut', action_value: ['GUI', 'LEFT_ARROW'] },
    { short_label: 'TASK', label: 'Task View', action_type: 'shortcut', action_value: ['GUI', 'TAB'] },
    { short_label: 'RUN', label: 'Run Dialog', action_type: 'shortcut', action_value: ['GUI', 'R'] },
    { short_label: 'MUTE', label: 'System Mute', action_type: 'media', action_value: ['MUTE'] },
  ]
};

export const presetMacOSMode: Mode = {
  name: 'macOS',
  icon: 'MAC',
  enc_label: 'BRIGH',
  enc_cw: { action_type: 'media', action_value: 'BRIGHTNESS_INCREMENT' },
  enc_ccw: { action_type: 'media', action_value: 'BRIGHTNESS_DECREMENT' },
  keys: [
    { short_label: 'MISS', label: 'Mission Control', action_type: 'shortcut', action_value: ['CONTROL', 'UP_ARROW'] },
    { short_label: 'LOCK', label: 'Lock Screen', action_type: 'shortcut', action_value: ['CONTROL', 'GUI', 'Q'] },
    { short_label: 'SNAP', label: 'Screenshot Tool', action_type: 'shortcut', action_value: ['GUI', 'SHIFT', 'FOUR'] },
    { short_label: 'EMOJ', label: 'Emoji Picker', action_type: 'shortcut', action_value: ['CONTROL', 'GUI', 'SPACE'] },
    { short_label: 'CLIP', label: 'Clipboard History', action_type: 'shortcut', action_value: ['GUI', 'SHIFT', 'V'] },
    { short_label: 'TILE', label: 'Tile Window Left', action_type: 'shortcut', action_value: ['CONTROL', 'GUI', 'LEFT_ARROW'] },
    { short_label: 'SWAP', label: 'App Switcher', action_type: 'shortcut', action_value: ['GUI', 'TAB'] },
    { short_label: 'SRCH', label: 'Spotlight Search', action_type: 'shortcut', action_value: ['GUI', 'SPACE'] },
    { short_label: 'MUTE', label: 'System Mute', action_type: 'media', action_value: ['MUTE'] },
  ]
};

export const presetLinuxMode: Mode = {
  name: 'Linux',
  icon: 'LINX',
  enc_label: 'BRIGH',
  enc_cw: { action_type: 'media', action_value: 'BRIGHTNESS_INCREMENT' },
  enc_ccw: { action_type: 'media', action_value: 'BRIGHTNESS_DECREMENT' },
  keys: [
    { short_label: 'DSK', label: 'Show Desktop', action_type: 'shortcut', action_value: ['GUI', 'D'] },
    { short_label: 'LOCK', label: 'Lock Screen', action_type: 'shortcut', action_value: ['GUI', 'L'] },
    { short_label: 'SNAP', label: 'Screenshot Tool', action_type: 'shortcut', action_value: ['SHIFT', 'PRINT_SCREEN'] },
    { short_label: 'EMOJ', label: 'Emoji Picker', action_type: 'shortcut', action_value: ['CONTROL', 'PERIOD'] },
    { short_label: 'CLIP', label: 'Clipboard Manager', action_type: 'shortcut', action_value: ['GUI', 'V'] },
    { short_label: 'LEFT', label: 'Snap Window Left', action_type: 'shortcut', action_value: ['GUI', 'LEFT_ARROW'] },
    { short_label: 'ACTV', label: 'Activities', action_type: 'shortcut', action_value: ['GUI'] },
    { short_label: 'TERM', label: 'Terminal', action_type: 'shortcut', action_value: ['CONTROL', 'ALT', 'T'] },
    { short_label: 'MUTE', label: 'System Mute', action_type: 'media', action_value: ['MUTE'] },
  ]
};

export const presetVSCodeMode: Mode = {
  name: 'VS Code',
  icon: 'CODE',
  enc_label: 'INDNT',
  enc_cw: { action_type: 'shortcut', action_value: 'RIGHT_BRACKET' },
  enc_ccw: { action_type: 'shortcut', action_value: 'LEFT_BRACKET' },
  keys: [
    { short_label: 'CMD', label: 'Command Palette', action_type: 'shortcut', action_value: ['CONTROL', 'SHIFT', 'P'] },
    { short_label: 'FILE', label: 'Quick File Search', action_type: 'shortcut', action_value: ['CONTROL', 'P'] },
    { short_label: 'TERM', label: 'Toggle Terminal', action_type: 'shortcut', action_value: ['CONTROL', 'GRAVE'] },
    { short_label: 'CMNT', label: 'Comment Line', action_type: 'shortcut', action_value: ['CONTROL', 'SLASH'] },
    { short_label: 'RENM', label: 'Rename Symbol', action_type: 'shortcut', action_value: ['F2'] },
    { short_label: 'FMT', label: 'Format Document', action_type: 'shortcut', action_value: ['SHIFT', 'ALT', 'F'] },
    { short_label: 'MLTI', label: 'Multi Cursor', action_type: 'shortcut', action_value: ['CONTROL', 'ALT', 'DOWN_ARROW'] },
    { short_label: 'DEF', label: 'Go to Definition', action_type: 'shortcut', action_value: ['F12'] },
    { short_label: 'RUN', label: 'Run/Debug', action_type: 'shortcut', action_value: ['F5'] },
  ]
};

export const presetMediaMode: Mode = {
  name: 'Media',
  icon: 'MED',
  enc_label: 'VOL',
  enc_cw: { action_type: 'media', action_value: 'VOLUME_INCREMENT' },
  enc_ccw: { action_type: 'media', action_value: 'VOLUME_DECREMENT' },
  keys: [
    { short_label: 'PREV', label: 'Previous Track', action_type: 'media', action_value: ['SCAN_PREVIOUS_TRACK'] },
    { short_label: 'PLAY', label: 'Play / Pause', action_type: 'media', action_value: ['PLAY_PAUSE'] },
    { short_label: 'NEXT', label: 'Next Track', action_type: 'media', action_value: ['SCAN_NEXT_TRACK'] },
    { short_label: 'MIC', label: 'Microphone Mute', action_type: 'none', action_value: [] },
    { short_label: 'MUTE', label: 'System Mute', action_type: 'media', action_value: ['MUTE'] },
    { short_label: 'CAM', label: 'Camera Toggle', action_type: 'none', action_value: [] },
    { short_label: 'MIX', label: 'Volume Mixer', action_type: 'none', action_value: [] },
    { short_label: 'MUSC', label: 'Open Music App', action_type: 'none', action_value: [] },
    { short_label: 'OVR', label: 'Media Overlay', action_type: 'none', action_value: [] },
  ]
};
