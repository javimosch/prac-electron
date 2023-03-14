import { getLocalDB } from "../electron-store";

import {getCurrCfg} from '../electron-store'

interface ValueItem {
  name:string,
  value:Object|Array<any>|string|null
}

export default async function saveSourceItems(
  options: { values: ValueItem[]; configName: string } = {
    values: [],
    configName: "",
  }
) {
  const currCfg = getCurrCfg(options.configName || "");
  options.values.forEach((valueItem: ValueItem) => {
    console.log("setConfigValues", {
      valueItem: valueItem,
    });
    currCfg.set(valueItem.name, valueItem.value);
  });
}
