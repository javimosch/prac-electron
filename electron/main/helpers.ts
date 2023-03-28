import electronCfg from 'electron-cfg'
import { getLocalDB } from "./electron-store";

export function getLogsFolder(){
    return electronCfg.resolveUserDataPath("")
}

export function msToTime(s: any) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return hrs + ":" + mins + ":" + secs + "." + ms;
}

/*
export async function isScanRequired(options: {configurationName:string}){
    const db = getLocalDB(options.configurationName)
    let isAnalysisComplete = await db.get("analysis", false);

    
  
    let isScanRequired =
      !isAnalysisComplete ||
      configId != computedConfigId ||
      (sourceFiles.length === 0 && uniqueFiles.length === 0);
}*/

export function processOptions(sources: any[], options: any) {
  options.include = (options.include || []).map((ext: string) =>
    ext.toLowerCase()
  );
  if (options.include.includes(".jpg") && !options.include.includes(".jpeg")) {
    options.include.push(".jpeg");
  }
  if (options.include.includes(".jpeg") && !options.include.includes(".jpg")) {
    options.include.push(".jpg");
  }

  options.include.forEach((ext: string) => {
    options.include.push(ext.toUpperCase());
  });

  let extensions = options.include.map((ext: any) =>
    (ext.charAt(0) === "." ? ext.substring(1) : ext).toLowerCase()
  );
  extensions = extensions.filter(
    (ext: any, i: Number) => extensions.findIndex((e: any) => e == ext) == i
  );

  const isDedupe = options.mainAction === "dedupe";
  const isCopy = options.mainAction === "copy";
  const isClean = options.mainAction === "clean";
  const isAnalysis = options.isAnalysis;
  const isDryRun = options.isDryRun;
  const configurationName = options.name;

  let hasMissingParameters = false;
  let errors: string[] = [];
  if (sources.length === 0) {
    errors.push("Missing source paths");
    hasMissingParameters = true;
  }

  if (!options.targetDirectory) {
    errors.push("Missing target directory");
    hasMissingParameters = true;
  }

  let computedConfigId = JSON.stringify({
    sources,
    targetDirectory: options.targetDirectory,
  });

  return {
    errors,
    hasMissingParameters,
    extensions,
    isDedupe,
    isCopy,
    isClean,
    isAnalysis,
    isDryRun,
    configurationName,
    computedConfigId
  };
}
