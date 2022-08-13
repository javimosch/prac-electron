export interface IElectronAPI {
  loadPreferences: () => Promise<void>;
  selectSourceFolders: () => Promise<string[]>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
