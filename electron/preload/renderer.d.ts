export interface IElectronAPI {
  isPackaged: () => Promise<boolean>;
  selectMultipleFolders: () => Promise<string[]>;
  selectSingleFolder: () => Promise<string[]>;
  analyzeSources: (sources: String[], options: any) => Promise<void>;
  onEvent: (callback: Function) => any;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
