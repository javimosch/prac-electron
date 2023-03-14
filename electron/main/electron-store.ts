import scope from "./state";
/**
 * Will get the current configuration stored in plain json
 * @param configurationName
 * @returns
 */
export function getCurrCfg(configurationName: string = "default"): any {
  if (!scope.currCfg) {
    const Store = require("electron-store");

    scope.currCfg = new Store({
      configurationName: configurationName.split(".")[0],
    });
  }
  return scope.currCfg;
}

export function saveSourceItems(sourceItems:any = [], currCfg:any){
  currCfg.set(
    "sourceItems",
    sourceItems.map((sourcePath: string) => {
      return {
        fullPath: sourcePath,
      };
    })
  );
  console.log(`electron-store saveSourceItems ${sourceItems.length}`)
}



export function getLocalDB(configurationName:string = ""){
  let electronStoreInstance = getCurrCfg(configurationName)
  return {
    saveSourceItems(sourceItems:any = []){
      saveSourceItems(sourceItems, electronStoreInstance)
    },
    saveConfigurationProperty
  }

  /**
   * App configuration setting ig sourceItems
   * @param name 
   * @param value 
   */
  function saveConfigurationProperty(name:string, value:any){
    electronStoreInstance.set(
      name,
      value
    );
  }
}
