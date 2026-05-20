/// <reference types="@types/w3c-web-serial" />

export class SerialManager {
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader | null = null;
  private writer: WritableStreamDefaultWriter | null = null;
  private textDecoder = new TextDecoder();
  private textEncoder = new TextEncoder();

  async connect(): Promise<boolean> {
    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: 115200 });
      this.writer = this.port!.writable!.getWriter();
      this.reader = this.port!.readable!.getReader();
      return true;
    } catch (err) {
      console.error("Serial connection failed:", err);
      return false;
    }
  }

  async disconnect() {
    if (this.reader) {
      this.reader.releaseLock();
      this.reader = null;
    }
    if (this.writer) {
      this.writer.releaseLock();
      this.writer = null;
    }
    if (this.port) {
      await this.port.close();
      this.port = null;
    }
  }

  isConnected() {
    return this.port !== null;
  }

  async write(data: string) {
    if (!this.writer) throw new Error("Not connected");
    await this.writer.write(this.textEncoder.encode(data));
  }

  async readUntil(prompt: string, timeoutMs = 2000): Promise<string> {
    if (!this.reader) throw new Error("Not connected");
    let result = "";
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      // Create a timeout promise for the read operation
      const readPromise = this.reader.read();
      const timeoutPromise = new Promise<any>((_, reject) => {
        setTimeout(() => reject(new Error("Read timeout")), 500);
      });
      
      try {
        const { value, done } = await Promise.race([readPromise, timeoutPromise]);
        if (done) break;
        result += this.textDecoder.decode(value);
        if (result.includes(prompt)) {
          break;
        }
      } catch (err) {
        // Timeout or other error during single read, just continue loop to check total timeout
      }
    }
    
    return result;
  }

  async enterREPL() {
    // Send Ctrl-C (0x03)
    await this.write('\x03');
    await new Promise(r => setTimeout(r, 100));
    // Send another Ctrl-C just in case
    await this.write('\x03');
    await this.readUntil(">>>", 2000);
  }

  async softReboot() {
    // Send Ctrl-D (0x04)
    await this.write('\x04');
  }

  async readShortcutsFile(): Promise<string> {
    await this.enterREPL();
    
    const script = `
import json
try:
    with open('shortcuts.json', 'r') as f:
        print("___START___")
        print(f.read())
        print("___END___")
except:
    print("___START___")
    print("[]")
    print("___END___")
`;
    
    await this.write(script + '\r\n');
    const output = await this.readUntil("___END___", 5000);
    
    const startIdx = output.indexOf("___START___");
    const endIdx = output.indexOf("___END___");
    
    if (startIdx !== -1 && endIdx !== -1) {
      return output.substring(startIdx + 11, endIdx).trim();
    }
    return "";
  }

  async writeShortcutsFile(content: string): Promise<boolean> {
    await this.enterREPL();
    
    // We send line by line or chunk by chunk to avoid buffer overflow
    await this.write(`f = open('shortcuts.json', 'w')\r\n`);
    await new Promise(r => setTimeout(r, 100));
    
    // Chunk string into 64 char blocks
    const chunkSize = 64;
    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize);
      // Escape backslashes, single quotes, and newlines
      const safeChunk = chunk.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\\n/g, '\\n').replace(/\\r/g, '\\r');
      await this.write(`f.write('${safeChunk}')\r\n`);
      await new Promise(r => setTimeout(r, 50));
    }
    
    await this.write(`f.close()\r\n`);
    await new Promise(r => setTimeout(r, 100));
    
    return true;
  }
}

export const serialManager = new SerialManager();
