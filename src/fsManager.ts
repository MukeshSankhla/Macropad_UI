export class FSManager {
  private directoryHandle: FileSystemDirectoryHandle | null = null;
  private directoryName: string = "";

  isConnected(): boolean {
    return this.directoryHandle !== null;
  }

  getDirectoryName(): string {
    return this.directoryName;
  }

  async connect(): Promise<boolean> {
    try {
      this.directoryHandle = await window.showDirectoryPicker({
        mode: 'readwrite',
      });
      this.directoryName = this.directoryHandle.name;
      return true;
    } catch (e) {
      console.error("Failed to connect to directory", e);
      return false;
    }
  }

  async disconnect() {
    this.directoryHandle = null;
    this.directoryName = "";
  }

  async readModesFile(): Promise<string> {
    if (!this.directoryHandle) throw new Error("Not connected");
    try {
      const fileHandle = await this.directoryHandle.getFileHandle('modes.py');
      const file = await fileHandle.getFile();
      return await file.text();
    } catch (e) {
      // File might not exist
      return "";
    }
  }

  async writeModesFile(content: string): Promise<boolean> {
    if (!this.directoryHandle) throw new Error("Not connected");
    try {
      const fileHandle = await this.directoryHandle.getFileHandle('modes.py', { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      return true;
    } catch (e) {
      console.error("Failed to write modes.py", e);
      return false;
    }
  }
}

export const fsManager = new FSManager();
