
let electronStoreConfigs:any = {}
/**
 * Will get the current configuration stored in plain json
 * @param configurationName
 * @returns
 */
export function getCurrCfg(configurationName: string = "default"): any {
  if (!electronStoreConfigs[configurationName]) {
    const Store = require("electron-store");

    electronStoreConfigs[configurationName] = new Store({
      configurationName: configurationName.split(".")[0],
    });
  }
  return electronStoreConfigs[configurationName]
}




export function getLocalDB(configurationName:string = ""){
  let electronStoreInstance = getCurrCfg(configurationName)
  return {
    set,
    get
  }

  /**
   * App configuration setting ig sourceItems
   * @param name 
   * @param value 
   */
  async function set(name:string, value:any){
    electronStoreInstance.set(
      name,
      value
    );
  }

  async function get(name:string, defaultValue:any = null){
    return electronStoreInstance.get(name,defaultValue)
  }
}
