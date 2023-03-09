import { app, BrowserWindow, shell, ipcMain } from "electron";
import { release } from "os"; 
import { join } from "path";
import sequential from "./promiseSequence";
import moment from "moment-timezone";
import * as rra from "recursive-readdir-async";
import customActions from './customActions';
//import { ConstraintViolationException } from "@mikro-orm/core";




//import { customAlphabet } from "nanoid/async";
//const { customAlphabet } = require("nanoid/async");

/*import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm-config';

const ormStart = async()=>{
  const orm = await MikroORM.init(config);
}
ormStart().then(console.log).catch(console.error);
*/

const consoleLog = require("electron-log");
consoleLog.catchErrors({
  showDialog: true,
});
//Object.assign(console, consoleLog.functions);
const mime = require("mime-types");
const path = require("path");
const cfg = require("electron-cfg");
const md5File = require("md5-file");
const emptyDir = require("empty-dir");
const sander = require("sander");
const isProduction = process.env.NODE_ENV === "production";
//const nanoid = customAlphabet("123456789", 10);
const shortid = require("shortid");
const nanoid = async (len: number) => shortid.generate();
//quire("amd-loader");
//var readfiles = require("node-readfiles");

const analysisStats: any = {
  sourceStats: [],
  targetStats: [],
};
const resultStats: any = {
  freedSize: 0,
  filesCount: 0,
  dupesCount: 0,

  originalCount: 0,
  originalSize: 0,
  finalCount: 0,
  finalSize: 0,
  removedFilesCount: 0,

  copyCount: 0,
  copySize: 0,
  dedupeCount: 0,
  dedupeSize: 0,
};
const scope: any = {
  analysisStats,
  resultStats,
};

let logLevel = "normal";

let mainActionLabelVerb: { [index: string]: any } = {
  copy: "Copy",
  move: "Move",
};
let mainActionLabelPast: { [index: string]: any } = {
  copy: "Copied",
  move: "Moved",
  clean: "Cleaned",
};

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, "../.."),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? "../.." : "../../../public"),
}; 

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin

const url = `http://${process.env["VITE_DEV_SERVER_HOSTNAME"]}:${process.env["VITE_DEV_SERVER_PORT"]}`;
const indexHtml = join(ROOT_PATH.dist, "index.html");

async function createWindow() { 
  const winCfg = cfg.window();
  win = new BrowserWindow({
    minWidth: 1280,
    minHeight: 720,
    width: 1280,
    maxWidth:1920,
    height: 720,
    resizable: true,
    title: "PRAK",
    icon: join(ROOT_PATH.public, "favicon.ico"),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: true,
    },
    ...winCfg.options(),
  });
  winCfg.assign(win);

  if (app.isPackaged) {
    win.loadFile(indexHtml);
  } else {
    consoleLog.log("loadURL", url);
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.on("did-finish-load", () => {
    win?.webContents.setZoomFactor(1);
    //win.webContents.setVisualZoomLevelLimits(1, 1)
    //win.webContents.setLayoutZoomLevelLimits(0, 0)
  });

  //if (isProduction) {
    win.setMenu(null);
  //}
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// new window example arg: new windows url
ipcMain.handle("open-win", (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  });

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg });
  } else {
    consoleLog.log("loadURL", url);
    childWindow.loadURL(`${url}/#${arg}`);
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
});

ipcMain.handle("isPackaged", async () => {
  return app.isPackaged;
});
ipcMain.handle("selectMultipleFolders", async () => {
  const { dialog } = require("electron");
  let res;
  win && win.setAlwaysOnTop(false);
  let focusedWindow = win || BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    res = await dialog.showOpenDialog(focusedWindow, {
      properties: ["openDirectory", "multiSelections"],
    });

    return res.filePaths;
  } else {
    res = await dialog.showOpenDialog({
      properties: ["openDirectory", "multiSelections"],
    });

    return res.filePaths;
  }
});
ipcMain.handle("selectSingleFolder", async () => {
  const { dialog } = require("electron");
  let res;
  win && win.setAlwaysOnTop(false);
  let focusedWindow = win || BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    res = await dialog.showOpenDialog(focusedWindow, {
      properties: ["openDirectory"],
    });
  } else {
    res = { filePaths: [] };
  }

  return res.filePaths;
});

function getCurrCfg(configurationName: string = "default"): any {
  if (!scope.currCfg) {
    const Store = require("electron-store");

    scope.currCfg = new Store({
      configurationName: configurationName.split(".")[0],
    });
  }
  return scope.currCfg;
}

ipcMain.handle("openLogsFolder", async () => {
  shell.showItemInFolder(cfg.resolveUserDataPath("logs/main.log"));
});

ipcMain.handle(
  "getConfiguration",
  async (event, configurationName = "default.json") => {
    const currCfg = getCurrCfg(configurationName);
    return {
      sourceItems: currCfg.get("sourceItems", []),
      targetItem: currCfg.get("targetItem", {
        fullPath: "",
      }),
      extensions: currCfg.get("extensions"),
    };
  }
);



ipcMain.handle("customAction", async (event, options = {}) => {
  consoleLog.log("customAction", {
    options,
  });

  if(customActions[options.name]){
    let r = await customActions[options.name].apply(customActions,[options])
    return r
  }


  if (options.name === "cleanAnalysisCache") {
    const currCfg = getCurrCfg(options.name);
    currCfg.set("analysis", false);
    sendEvent({
      hasAnalysisCache: false,
    });
  }

  if (options.name === "setConfigValues") {
    const currCfg = getCurrCfg(options.configName);
    options.values.forEach((valueItem: any) => {
      console.log("setConfigValues", {
        valueItem: valueItem,
      });
      currCfg.set(valueItem.name, valueItem.value);
    });
  }
});

/**
 * Prepares and retrieves stat item given a read object
 * @param obj
 * @returns
 */
function getStatItem(obj: any, attr = "sourceStats") {
  let extension = (obj.extension || "").split(".").join("") || "unknown"; //Fallback to grabing the ext as it is
  if (!extension) {
    console.log({
      obj,
    });
    throw new Error("Compute extension fail");
  }

  let statItem: any = scope.analysisStats[attr].find(
    (item: any) => item.ext == extension
  );
  if (!statItem) {
    statItem = {
      ext: extension,
      count: 0,
      size: 0,
      dupesCount: 0,
      dupesSize: 0,
    };
    scope.analysisStats[attr].push(statItem);
  }
  return statItem;
}

function isFilteredFile(file: any, include: Array<any>) {
  return (
    (!file.isDirectory && include.length === 0) ||
    include.some(
      (str: String) => str.toLowerCase() == file.extension.toLowerCase()
    )
  );
}

ipcMain.handle("analyzeSources", async (event, sources = [], options = {}) => {
  const currCfg = getCurrCfg(options.name);

  const isDedupe = options.mainAction === "dedupe";
  const isCopy = options.mainAction === "copy";
  const isClean = options.mainAction === "clean";
  const isAnalysis = options.isAnalysis;
  const isDryRun = options.isDryRun;

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
  currCfg.set("extensions", extensions);

  consoleLog.debug(
    "analyzeSources",
    JSON.stringify(
      {
        sources,
        options,
      },
      null,
      4
    )
  );

  consoleLog.info("Include", options.include);
  consoleLog.info("Extensions", extensions);

  logLevel = options.loggingLevel || logLevel;

  if (sources.length === 0) {
    consoleLog.error("Missing source paths");
    return;
  }

  if (!options.targetDirectory) {
    consoleLog.error("Missing target directory");
    return;
  }

  console.log("sources", {
    sources,
  });

  let computedConfigId = JSON.stringify({
    sources,
    targetDirectory: options.targetDirectory,
  });
  let configId = currCfg.get("id", computedConfigId);

  let duplicatedFiles = currCfg.get("duplicatedFiles", []);
  let sourceFiles = currCfg.get("sourceFiles", []);
  let targetFiles = currCfg.get("targetFiles", []);
  let uniqueFiles = currCfg.get("uniqueFiles", []);
  let targetFilesDupes = currCfg.get("targetFilesDupes", []);

  let isAnalysisComplete = currCfg.get("analysis", false);
  let existingFilesInTargetDir: any[] = currCfg.get(
    "existingFilesInTargetDir",
    []
  );

  let hasInvalidCache =
    isDedupe ||
    !isAnalysisComplete ||
    configId != computedConfigId ||
    (sourceFiles.length === 0 && uniqueFiles.length === 0);

  console.log("hasInvalidCache", {
    "!isAnalysisComplete": !isAnalysisComplete,
    "configId != computedConfigId": configId != computedConfigId,
    "(sourceFiles.length === 0 && uniqueFiles.length === 0)":
      sourceFiles.length === 0 && uniqueFiles.length === 0,
    configId,
    computedConfigId,
  });

  if (hasInvalidCache) {
    configId = computedConfigId;
    isAnalysisComplete = false;

    sendEvent({
      hasAnalysisCache: false,
    });
  }

  //Force analysis
  //isAnalysisComplete = false;

  let processingPercent = 0;

  if (!isAnalysisComplete) {

    console.log("Analsis start")

    //Analysis start
    scope.analysisStats.sourceStats = [];
    scope.analysisStats.targetStats = [];

    sendEvent({
      processingPercent,
    });

    //=== SOURCE DIRECTORY === START =================================
    //let readResultsPartial: any = [];
    sourceFiles = [];
    await sequential(
      sources.map((sourcePath: string) => {
        return async () => {
          //files
          let files = await rraListWrapper(
            sourcePath,
            {
              mode: rra.LIST,
              recursive: true,
              stats: true,
              ignoreFolders: true,
              extensions: true,
              deep: true,
              realPath: true,
              normalizePath: true,
              include: options.include || [],
              //exclude: [],
              readContent: false,
              //encoding: 'base64'
            },
            function (obj: any, index: Number, total: Number) {
              if (isFilteredFile(obj, options.include)) {
                obj.sourcePath = sourcePath;
                let statItem: any = getStatItem(obj);
                statItem.count++;
                statItem.size += obj.stats.size;
                sendEventStats({
                  sourceStats: scope.analysisStats.sourceStats,
                });
                sendEvent({
                  processingMessage: "Reading source files...",
                });
                sourceFiles.push(obj);
                return false;
              } else {
                return true;
              }
            }
          );
        }; //();
      })
    );
    /* consoleLog.debug({
      readResults,
    });*/
    /*let files = readResults.reduce((a: any[], v: any[]) => {
      a = [...a, ...v];
      return a;
    }, []);*/

    consoleLog.info(`${sourceFiles.length} source files detected`);

    processingPercent = 10;
    sendEvent({
      processingPercent,
    });

    consoleLog.info("Generating source files MD5");

    let processingPercentAnimate = processingPercent;
    await sequential(
      sourceFiles.map((file: any, index: number) => {
        return async () => {
          //grab md5
          let md5 = file.md5 || (await md5File(file.fullname));
          file.md5 = md5;
          file.uniqueId = await nanoid(5);

          processingPercent = Math.round(
            processingPercentAnimate + 20 * ((index + 1) / sourceFiles.length)
          );
          sendEvent({
            processingPercent,
            processingMessage: "Generating source files md5...",
          });
        }; //();
      })
    );
    processingPercentAnimate = processingPercent;

    sendEvent({
      processingPercent,
    });

    //source unique files
    uniqueFiles = sourceFiles.filter(
      (f: any, i: Number) =>
        sourceFiles.findIndex((ff: any) => ff.md5 == f.md5) == i
    );

    /*
    sourceFiles.forEach((file: any, index: Number) => {
      file.duplicates = sourceFiles
        .filter((v: any, i: Number) => i !== index)
        .filter((f: any) => f.md5 == file.md5)
        .map((f: any) => f.fullname);
    });*/

    //=== SOURCE DIRECTORY === END =================================

    //=== TARGET DIRECTORY === START =================================
    //Read files in the target dir

    if (!isDedupe) {
      targetFiles = await rraListWrapper(
        options.targetDirectory,
        {
          mode: rra.LIST,
          recursive: true,
          stats: true,
          ignoreFolders: true,
          extensions: true,
          deep: true,
          realPath: true,
          normalizePath: true,
          include: options.include || [],
          readContent: false,
        },
        (obj: any) => {
          if (!obj.isDirectory) {
            let statItem: any = getStatItem(obj, "targetStats");
            statItem.count++;
            statItem.size += obj.stats.size;
            sendEventStats({
              targetStats: scope.analysisStats.targetStats,
            });
            return false;
          } else {
            return true;
          }
        }
      );

      consoleLog.info(`${targetFiles.length} files in target dir`);

      await sequential(
        targetFiles.map((file: any, index: number) => {
          return async () => {
            let md5 = file.md5 || (await md5File(file.fullname));
            file.md5 = md5;
            file.uniqueId = await nanoid(5);

            processingPercent = Math.round(
              processingPercentAnimate + 20 * ((index + 1) / targetFiles.length)
            );
            sendEvent({
              processingPercent,
              processingMessage: "Generating target files md5...",
            });
          }; //();
        })
      );
      existingFilesInTargetDir = uniqueFiles.filter(
        (f: any) => targetFiles.findIndex((ff: any) => ff.md5 == f.md5) >= 0
      );
      currCfg.set("existingFilesInTargetDir", existingFilesInTargetDir);

      //filter out existing files in target dir
      uniqueFiles = uniqueFiles.filter((f: any, i: Number) => {
        let r = !existingFilesInTargetDir.some((ff: any) => ff.md5 == f.md5);
        return r;
      });
      consoleLog.info(
        `${existingFilesInTargetDir.length} files from source directory already in target directory`
      );

      targetFilesDupes = getDuplicatedFiles(targetFiles, options.removePriority);

      targetFilesDupes.forEach((dupeFile: any) => {
        let statItem = getStatItem(dupeFile, "targetStats");
        statItem.dupesCount++;
        statItem.dupesSize += dupeFile.stats.size;
        sendEventStats({
          targetStats: scope.analysisStats.targetStats,
        });
      });
      currCfg.set("targetFilesDupes", targetFilesDupes);
    }
    //=== TARGET DIRECTORY === END =================================

    processingPercentAnimate = processingPercent;

    //duplicated files (source only)
    /*
    duplicatedFiles = sourceFiles.filter(
      (f: any, i: Number) =>
        !uniqueFiles.some((ff: any) => ff.uniqueId == f.uniqueId) //TODO use unique identifier
    );*/


    console.log('Calculate dupes in source directory');
    duplicatedFiles = getDuplicatedFiles(sourceFiles, options.removePriority);

    duplicatedFiles.forEach((dupeFile: any) => {
      let statItem = getStatItem(dupeFile, "sourceStats");
      statItem.dupesCount++;
      statItem.dupesSize += dupeFile.stats.size;
      sendEventStats({
        sourceStats: scope.analysisStats.sourceStats,
      });
    });

    consoleLog.info({
      uniqueFilesCount: uniqueFiles.length,
      duplicatedFilesCount: duplicatedFiles.length,
    });

    const renamedCount = 0;
    uniqueFiles.forEach((file: any, index: number) => {
      let hasSomeWithSameName = uniqueFiles.some(
        (f: any, i: number) =>
          i != index && f.md5 != file.md5 && f.name == file.name && !f.newName
      );
      if (hasSomeWithSameName) {
        file.newName =
          file.name.split(file.extension).join("") +
          "_" +
          file.uniqueId +
          file.extension;
        /*consoleLog.verbose(
          `${file.fullname} -> ${file.newName} (${
            isDryRun ? "would" : "will"
          } be renamed)`
        );*/
      }
    });

    consoleLog.info(`${renamedCount} files will be renamed`);

    consoleLog.info(
      `${uniqueFiles.length} unique files detected (After checking duplicates in target directory)`
    );

    currCfg.set(
      "sourceItems",
      sources.map((sourcePath: string) => {
        return {
          fullPath: sourcePath,
        };
      })
    );

    currCfg.set("targetItem", {
      fullPath: options.targetDirectory,
    });
    isAnalysisComplete = true;
    currCfg.set("analysis", isAnalysisComplete);
    currCfg.set("targetFiles", targetFiles);
    currCfg.set("sourceFiles", sourceFiles);
    currCfg.set("uniqueFiles", uniqueFiles);
    currCfg.set("duplicatedFiles", duplicatedFiles);
    currCfg.set("timestamp", moment().toDate().getTime());
    currCfg.set("date", moment().format("YYYY-MM-DD HH:mm:ss"));
    currCfg.set("id", configId);
    consoleLog.log("Analysis successful", configId);
  } else {
    consoleLog.info("Restoring analysis");
    sendEventStatsUsingCacheAnalysis(sourceFiles, targetFiles, duplicatedFiles);
  }

  //Analysis complete
  sendEvent({
    hasAnalysisCache: isDedupe ? false : true,
  });
  //=====

  let affectedFilesCount = ["move", "copy"].includes(options.mainAction)
    ? uniqueFiles.length
    : existingFilesInTargetDir.length;

  if (options.mainAction === "dedupe") {
    affectedFilesCount = sourceFiles.length;
  }

  //Reset result stats
  Object.keys(scope.resultStats).forEach((key) => {
    scope.resultStats[key] = 0;
  });

  scope.resultStats.filesCount = affectedFilesCount;

  consoleLog.log(
    `${affectedFilesCount} files ${isDryRun ? "would be" : "will be"} ${
      mainActionLabelPast[options.mainAction.toString()]
    }`
  );

  if (isAnalysis) {
    consoleLog.log("Finish after analysis");
  } else {
    processingPercent = 0;

    //CLEAN: If clean, remove skipped files from sources
    if (["clean"].includes(options.mainAction)) {
      scope.resultStats.originalCount = sourceFiles.length;
      scope.resultStats.originalSize = sourceFiles.reduce(
        (a: Number, f: any) => a + f.stats.size,
        0
      );
      processingPercent = await removeFiles(existingFilesInTargetDir, {
        isDryRun,
        processingPercent,
        reason: "clean",
      });
      scope.resultStats.finalCount =
        scope.resultStats.originalCount - scope.resultStats.removedFilesCount;
      scope.resultStats.finalSize =
        scope.resultStats.originalSize - scope.resultStats.freedSize;
    }

    //DEDUPE: Remove duplicates in source directories
    if (["dedupe", "clean"].includes(options.mainAction)) {
      scope.resultStats.originalCount = sourceFiles.length;
      scope.resultStats.originalSize = sourceFiles.reduce(
        (a: Number, f: any) => a + f.stats.size,
        0
      );
      processingPercent = await removeFiles(duplicatedFiles, {
        isDryRun,
        processingPercent,
        reason: "dedupe",
      });
      scope.resultStats.finalCount =
        scope.resultStats.originalCount - scope.resultStats.removedFilesCount;
      scope.resultStats.finalSize =
        scope.resultStats.originalSize - scope.resultStats.freedSize;
    }

    //COPY OR MOVE MAIN ACTION
    if (["copy", "move"].includes(options.mainAction)) {
      scope.resultStats.originalCount = existingFilesInTargetDir.length;
      scope.resultStats.originalSize = existingFilesInTargetDir.reduce(
        (a: Number, f: any) => a + f.stats.size,
        0
      );

      let processingPercentAnimate = processingPercent;

      let copiedFiles: any = [];

      await sequential(
        uniqueFiles.map((file: any, index: number) => {
          return async () => {
            let sourcePath = file.fullname;
            let sourceBasePath = file.path;
            let sourceFileName = file.name;

            let targetBasePath = options.targetDirectory;
            let targetFileName = file.newName || file.name;
            let targetPath = path.join(targetBasePath, targetFileName);

            //FLAT MODE
            if (options.targetDirectoryStructure === "flat") {
              targetPath = path.join(targetBasePath, targetFileName);
              if (!isDryRun) {
                await copyOrMoveFile(
                  options.mainAction,
                  sourceBasePath,
                  sourceFileName,
                  targetBasePath,
                  targetFileName
                );
              }
            }

            //DATE MODE
            if (options.targetDirectoryStructure === "date") {
              let exifDate = await getExifDate(sourcePath);
              let createdDate = exifDate
                ? moment(exifDate)
                : moment(file.stats.ctime);
              targetBasePath = path.join(
                targetBasePath,
                createdDate.format("YYYY"),
                createdDate.format("MM"),
                createdDate.format("DD")
              );
              targetPath = path.join(targetBasePath, targetFileName);
              if (!isDryRun) {
                await copyOrMoveFile(
                  options.mainAction,
                  sourceBasePath,
                  sourceFileName,
                  targetBasePath,
                  targetFileName
                );
              }
            }

            //TYPE MODE
            if (options.targetDirectoryStructure === "type") {
              let mimeType = mime.lookup(targetFileName);
              if (!mimeType) {
                mimeType = file.extension.split(".").join(""); //Fallback to grabing the ext as it is
              }
              mimeType = mimeType.split("/").join("-");
              mimeType = mimeType || "unknown";
              targetBasePath = path.join(targetBasePath, mimeType);
              targetPath = path.join(targetBasePath, targetFileName);
              if (!isDryRun) {
                await copyOrMoveFile(
                  options.mainAction,
                  sourceBasePath,
                  sourceFileName,
                  targetBasePath,
                  targetFileName
                );
              }
            }

            if (
              !["flat", "date", "type"].includes(
                options.targetDirectoryStructure
              )
            ) {
              consoleLog.warn(
                `${options.targetDirectoryStructure} mode not implemented (Structure)`
              );
            }
            consoleLog.verbose(
              `${file.fullname} to ${targetPath} ${
                isDryRun
                  ? `(Would be ${mainActionLabelPast[
                      options.mainAction
                    ].toLowerCase()})`
                  : `(${mainActionLabelPast[options.mainAction]})`
              }`
            );

            processingPercent = Math.round(
              processingPercentAnimate +
                100 * ((index + 1) / uniqueFiles.length)
            );

            scope.resultStats.copyCount++;
            scope.resultStats.copySize += file.stats.size;
            copiedFiles.push(file);

            sendEvent({
              processing: true,
              processingPercent,
              processingMessage: "Copying files...",
            });
          }; //();
        })
      );

      //Sum of size of skipped dupes for each copied file
      scope.resultStats.dedupeCount = copiedFiles.reduce(
        (a: Number, f: any) => {
          let dupesCount = duplicatedFiles.filter((ff: any) => {
            let isDupe = ff.md5 == f.md5;
            if (isDupe) {
              scope.resultStats.dedupeSize += ff.stats.size;
            }
            return isDupe;
          }).length;
          return a + dupesCount;
        },
        0
      );

      scope.resultStats.finalCount =
        scope.resultStats.originalCount + copiedFiles.length;
      scope.resultStats.finalSize =
        scope.resultStats.originalSize + sumFilesSize(copiedFiles);

      consoleLog.info(
        `${mainActionLabelVerb[options.mainAction]} process ended`
      );
    }
  }

  sendEvent({
    processing: false,
    processingPercent: 100,
    processingMessage: "",
    resultStats: {
      ...scope.resultStats,
    },
  });

  return;
});

async function getExifDate(filePath) {
  let buf;
  try {
    buf = await sander.readFile(filePath);
  } catch (err: any) {
    if (err.stack.includes("no such file")) {
      console.log("Failed to parse exif (not found)", filePath);
      return null;
    }
  }
  if (![".jpeg", ".jpg"].some((ext) => filePath.toLowerCase().includes(ext))) {
    return null;
  }
  try {
    var parser = require("exif-parser").create(buf);
    var result = parser.parse();
    let date = result?.tags?.CreateDate
      ? new Date(result?.tags?.CreateDate * 1000)
      : null;
    /*
console.log({
    result
})*/
    return date;
  } catch (err: any) {
    console.log("Failed to parse exif", {
      filePath,
      error: err.stack,
    });
    return null;
  }
}

function countCharInString(sentence, character) {
  let count = 0;
  for (let i = 0; i < sentence.length; i++) {
    if (sentence[i] === character) {
      count++;
    }
  }
  return count;
}

function getDuplicatedFiles(files: any[], removePriority: string) {
  console.log('getDuplicatedFiles')
  return files.reduce((a: any, f: any) => {
    if (a.some((fff: any) => fff.md5 == f.md5)) {
      return a; //already processed
    }
    let sameFiles = files.filter((ff:any)=> ff.md5 == f.md5 && ff.uniqueId != f.uniqueId);
    sameFiles.push(f)
    let isCloserToRoot = removePriority === 'CLOSER_TO_ROOT'
    sameFiles = sameFiles.sort((a,b)=>{
      return countCharInString(a.path, '/') < countCharInString(b.path, '/') ? (isCloserToRoot?-1:1) : (isCloserToRoot?1:-1)
    })
    sameFiles.pop() //Keep the latest
    return [...a, ...sameFiles]

/*
    let dupesArr = files.filter(
      (ff: any) => {
        if(ff.md5 == f.md5 && ff.uniqueId !== f.uniqueId){
          console.log('DUPE',{
            f,
            ff
          })
        }
        return ff.md5 == f.md5 && ff.uniqueId !== f.uniqueId
      }
    );
    a = [...a, ...dupesArr];
    */
    return a;
  }, []);
}

async function removeFiles(files: any = [], options: any = {}) {
  let reason = options.reason || "(no-reason)";
  options.processingPercentAnimate = options.processingPercentAnimate;
  await Promise.all(
    files.map((f: any, index: number) => {
      return (async () => {
        if (!options.isDryRun) {
          await tryCatchAsync(
            () => sander.rimraf(f.fullname),
            {
              path: f.fullname,
            },
            "Remove operation fail"
          );

          options.processingPercent = Math.round(
            options.processingPercentAnimate +
              (options.processingPercentIncrement || 100) *
                ((index + 1) / files.length)
          );
          scope.resultStats.freedSize += f.stats.size;
          scope.resultStats.removedFilesCount++;
          sendEvent({
            processingPercent: options.processingPercent,
            processingMessage: "Removing files...",
          });

          consoleLog.verbose(
            `${f.fullname} (Removed from sources) (${reason})`
          );
        } else {
          consoleLog.verbose(
            `${f.fullname} (Would remove from sources) (${reason})`
          );
        }
      })();
    })
  );
  consoleLog.info(
    `${files.length} files ${
      options.isDryRun ? "should have been" : "were"
    } removed (${reason})`
  );
  return options.processingPercent;
}

function sumFilesSize(arr: Array<any>) {
  return arr.reduce((a, v) => {
    return a + v.stats.size;
  }, 0);
}

async function copyOrMoveFile(
  mainAction: string,
  sourceBasePath: string,
  sourceFileName: string,
  targetBasePath: string,
  targetFileName: string
) {
  let targetPath = path.join(targetBasePath, targetFileName);
  if (mainAction === "copy") {
    await copyFile(path.join(sourceBasePath, sourceFileName), targetPath);
  }
  if (mainAction === "move") {
    await moveFile(
      sourceBasePath,
      sourceFileName,
      targetBasePath,
      targetFileName
    );
  }
}

async function copyFile(sourcePath: string, targetPath: string) {
  await tryCatchAsync(
    () => sander.copyFile(sourcePath).to(targetPath),
    {
      from: sourcePath,
      to: targetPath,
    },
    "Copy operation fail"
  );
}

async function moveFile(
  sourceBasePath: string,
  sourceFileName: string,
  targetBasePath: string,
  targetFileName: string
) {
  await tryCatchAsync(
    () =>
      sander
        .rename(sourceBasePath, sourceFileName)
        .to(targetBasePath, targetFileName),
    {
      from: path.join(sourceBasePath, sourceFileName),
      to: path.join(targetBasePath, targetFileName),
    },
    "Move operation fail"
  );
}

function sendEvent(props: any) {
  win?.webContents.send("event", props);
}

function sendEventStats(props: any) {
  win?.webContents.send("analysis_stat", props);
}

function sendEventStatsUsingCacheAnalysis(
  sourceFiles: Array<any>,
  targetFiles: Array<any>,
  duplicatedFiles: Array<any>
) {
  scope.analysisStats.sourceStats = [];
  scope.analysisStats.targetStats = [];
  sourceFiles.forEach((item) => {
    let statItem = getStatItem(item, "sourceStats");
    statItem.count++;
    statItem.size += item.stats.size;
  });
  targetFiles.forEach((item) => {
    let statItem = getStatItem(item, "targetStats");
    statItem.count++;
    statItem.size += item.stats.size;
  });

  duplicatedFiles.forEach((dupeFile: any) => {
    let statItem = getStatItem(dupeFile, "sourceStats");
    statItem.dupesCount++;
    statItem.dupesSize += dupeFile.stats.size;
  });

  sendEventStats({
    sourceStats: scope.analysisStats.sourceStats,
    targetStats: scope.analysisStats.targetStats,
  });
  console.log("sendEventStatsUsingCacheAnalysis", {
    sourceStats: scope.analysisStats.sourceStats.length,
    targetStats: scope.analysisStats.targetStats.length,
  });
}

async function rraListWrapper(
  path: string,
  options: any,
  callback: Function | null = null
) {
  callback = callback || (() => {});
  let res: any[] = [];
  // await tryCatchAsync(async () => {
  res = await rra.list.apply(rra, [path, options, callback || undefined]);

  if (!(res instanceof Array)) {
    let errorRes: any = res;
    console.log("reading-error", {
      errorRes: errorRes,
    });
    handleErrorLogging(
      new Error("Readdir error"),
      {
        details: errorRes.error,
        path: path,
      },
      "Failed to read directory"
    );
    res = [];
  }

  let someError = (res.find((r) => r.error) || {}).error;
  if (someError) {
    throw someError;
  }

  //});
  return res;
}

function handleErrorLogging(
  err: any,
  textOrObjectOrFunction: any = "System error",
  text: string = ""
) {
  if (
    typeof textOrObjectOrFunction === "string" ||
    typeof textOrObjectOrFunction === "function"
  ) {
    consoleLog.error(
      typeof textOrObjectOrFunction === "string"
        ? textOrObjectOrFunction
        : textOrObjectOrFunction(err)
    );
  }
  if (typeof textOrObjectOrFunction === "object") {
    consoleLog.error(
      `${text || "System error"}:${JSON.stringify(
        {
          ...(textOrObjectOrFunction || {}),
          err: err.message,
        },
        null,
        4
      )}`
    );
  }
}

async function tryCatchAsync(
  cb: Function,
  textOrObjectOrFunction: any = "System error",
  text: string = ""
) {
  try {
    await cb();
  } catch (err: any) {
    console.log(err);
    consoleLog.error(err);
    consoleLog.debug("ERROR", {
      err,
    });
    handleErrorLogging(err, textOrObjectOrFunction, text);
  }
}

function getHTMLParagraph(text: String, title = "Info") {
  //consoleLog.log(`${title}: ${text}`);
  return `<p><strong>${title}:&nbsp;</strong>${text}.</p>`;
}

let lastMessageStamp: number | null = null;
consoleLog.hooks.push((message: any, transport: any) => {
  if (transport === consoleLog.transports.console) {
    if (shouldSendConsoleEvent(message.level)) {
      sendEvent({
        html: getHTMLParagraph(message.data, message.level),
      });
    }

    let prefix = "";
    if (lastMessageStamp) {
      prefix = `${msToTime(Date.now() - lastMessageStamp)}`;
    }
    lastMessageStamp = Date.now();
    message.data.unshift(prefix);
  }

  return message;
});

function msToTime(s: any) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return hrs + ":" + mins + ":" + secs + "." + ms;
}

function shouldSendConsoleEvent(level: string) {
  if (["error"].includes(level) && logLevel === "error") {
    return true;
  }
  if (["error", "warn", "info"].includes(level) && logLevel === "normal") {
    return true;
  }
  if (
    ["error", "warn", "info", "verbose"].includes(level) &&
    logLevel === "verbose"
  ) {
    return true;
  }
  return false;
}
