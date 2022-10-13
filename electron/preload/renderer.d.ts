export interface IElectronAPI {
  isPackaged: () => Promise<boolean>;
  selectMultipleFolders: () => Promise<string[]>;
  selectSingleFolder: () => Promise<string[]>;
  analyzeSources: (sources: String[], options: any) => Promise<void>;
  onEvent: (callback: Function) => any;
  onAnalysisStat: (callback: Function) => any;
  getConfiguration: (name: string) => any[];
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
