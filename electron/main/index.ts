import { app, BrowserWindow, shell, ipcMain } from "electron";
import { release } from "os";
import { join } from "path";
import sequential from "./promiseSequence";
import moment from "moment-timezone";
import * as rra from "recursive-readdir-async";
//import { customAlphabet } from "nanoid/async";
//const { customAlphabet } = require("nanoid/async");

const consoleLog = require("electron-log");
consoleLog.catchErrors({
  showDialog: true,
});
//Object.assign(console, consoleLog.functions);

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

let logLevel = "normal";

let mainActionLabelVerb: { [index: string]: any } = {
  copy: "Copy",
  move: "Move",
};
let mainActionLabelPast: { [index: string]: any } = {
  copy: "Copied",
  move: "Moved",
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
const url = `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}`;
const indexHtml = join(ROOT_PATH.dist, "index.html");

async function createWindow() {
  const winCfg = cfg.window();
  win = new BrowserWindow({
    title: "Main window",
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

  if (isProduction) {
    win.setMenu(null);
  }
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

function getCurrCfg(configurationName: string = "default.json"): any {
  if (!configurationName.includes(".json")) {
    configurationName += ".json";
  }
  return cfg.create(configurationName);
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
    };
  }
);

ipcMain.handle("analyzeSources", async (event, sources = [], options = {}) => {
  const currCfg = getCurrCfg(options.name);

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

  options.include = (options.include || []).map((ext: string) =>
    ext.toLowerCase()
  );

  options.include.forEach((ext: string) => {
    options.include.push(ext.toUpperCase());
  });

  if (options.include.includes(".jpg") && !options.include.includes(".jpeg")) {
    options.include.push(".jpeg");
  }
  if (options.include.includes(".jpeg") && !options.include.includes(".jpg")) {
    options.include.push(".jpg");
  }

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

  consoleLog.info("Extensions", options.include);

  logLevel = options.loggingLevel || logLevel;

  if (sources.length === 0) {
    consoleLog.error("Missing source paths");
    return;
  }

  if (!options.targetDirectory) {
    consoleLog.error("Missing target directory");
    return;
  }

  let computedConfigId = JSON.stringify({
    sources,
    targetDirectory: options.targetDirectory,
  });
  let configId = currCfg.get("id", computedConfigId);
  let fileStats = currCfg.get("stats", []);
  let uniqueFileStats = currCfg.get("stats", []);
  let isAnalysisComplete = currCfg.get("analysis", false);

  if (configId != computedConfigId) {
    isAnalysisComplete = false;
  }

  if (fileStats.length === 0 && uniqueFileStats.length === 0) {
    isAnalysisComplete = false;
  }

  //Force analysis
  isAnalysisComplete = false;

  if (!isAnalysisComplete) {
    consoleLog.verbose("Running analysis");
    //Analysis start

    let readResults: any = await sequential(
      sources.map((sourcePath: string) => {
        return async () => {
          //files
          let files = await rra.list(
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
            function (obj: any) {
              if (obj.isDirectory) {
                return;
              }
              //consoleLog.log("File found", obj);
            }
          );
          return files.map((f: any) => {
            f.sourcePath = sourcePath;
            return f;
          });
        }; //();
      })
    );
    //consoleLog.debug(readResults);
    let files = readResults.reduce((a: any[], v: any[]) => {
      a = [...a, ...v];
      return a;
    }, []);

    consoleLog.info(`${files.length} detected files (Next: MD5 Generation)`);

    await sequential(
      files.map((file: any) => {
        return async () => {
          //grab md5
          let md5 = file.md5 || (await md5File(file.fullname));
          file.md5 = md5;
          file.uniqueId = await nanoid(5);
        }; //();
      })
    );

    consoleLog.verbose("Filtering out duplicates");

    files.forEach((file: any, index: Number) => {
      file.duplicates = files
        .filter((v: any, i: Number) => i !== index)
        .filter((f: any) => f.md5 == file.md5)
        .map((f: any) => f.fullname);
    });

    //Read files in the target dir

    let filesInTargetDir = await rra.list(options.targetDirectory, {
      mode: rra.LIST,
      recursive: true,
      stats: true,
      ignoreFolders: true,
      extensions: false,
      deep: true,
      realPath: true,
      normalizePath: true,
      include: options.include || [],
      readContent: false,
    });
    consoleLog.info(
      `${files.length} files in target dir (Next: MD5 Generation)`
    );
    await sequential(
      filesInTargetDir.map((file: any) => {
        return async () => {
          let md5 = file.md5 || (await md5File(file.fullname));
          file.md5 = md5;
        }; //();
      })
    );

    let uniqueFiles = files.filter(
      (f: any, i: Number) => files.findIndex((ff: any) => ff.md5 == f.md5) == i
    );
    let duplicatedFiles = files.filter(
      (f: any, i: Number) =>
        !uniqueFiles.some((ff: any) => ff.uniqueId == f.uniqueId) //TODO use unique identifier
    );
    duplicatedFiles.forEach((f: any, i: Number) => {
      consoleLog.verbose(`[${i}] ${f.name} / ${f.md5} duplicated (Skip)`);
    });
    consoleLog.info(
      `${uniqueFiles.length} unique files detected (After checking duplicates in source directories)`
    );
    let existingFilesInTargetDir = uniqueFiles.filter(
      (f: any) => filesInTargetDir.findIndex((ff: any) => ff.md5 == f.md5) >= 0
    );
    currCfg.set("existingFilesInTargetDir", existingFilesInTargetDir);

    //filter out existing files in target dir
    uniqueFiles = uniqueFiles.filter((f: any, i: Number) => {
      let r = !existingFilesInTargetDir.some((ff: any) => ff.md5 == f.md5);
      return r;
    });
    existingFilesInTargetDir.forEach((f: any, i: Number) => {
      consoleLog.verbose(
        `[${i}] ${f.name} / ${f.md5} found in target directory (Skip) `
      );
    });
    consoleLog.info(
      `${existingFilesInTargetDir.length} files which already exists in target directory will be skip`
    );

    //If "move", remove skipped files from sources
    if (options.mainAction === "move") {
      Promise.all(
        existingFilesInTargetDir.map((f: any) => {
          return (async () => {
            if (!options.isDryRun) {
              sander.rimraf(f.fullname);
              consoleLog.verbose(
                `${f.fullname} (Skipped file removed from sources)`
              );
            } else {
              consoleLog.verbose(
                `${f.fullname} (Skipped file would be removed from sources)`
              );
            }
          })();
        })
      ).then(() => {
        consoleLog.info(
          `${existingFilesInTargetDir.length} skipped files ${
            options.isDryRun ? "should have been" : "were"
          } removed from sources (Because already exists in target directory)`
        );
      });
    }

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
        consoleLog.verbose(
          `${file.fullname} -> ${file.newName} (${
            options.isDryRun ? "would" : "will"
          } be renamed)`
        );
      }
    });

    consoleLog.info(
      `${uniqueFiles.length} unique files detected (After checking duplicates in target directory)`
    );

    fileStats = files;
    uniqueFileStats = uniqueFiles;
  } else {
    consoleLog.verbose("Restoring analysis");
  }

  //Analysis complete
  isAnalysisComplete = true;
  currCfg.set("analysis", isAnalysisComplete);
  currCfg.set("fileStats", fileStats);
  currCfg.set("uniqueFileStats", uniqueFileStats);
  currCfg.set("timestamp", moment().toDate().getTime());
  currCfg.set("date", moment().format("YYYY-MM-DD HH:mm:ss"));
  //=====

  consoleLog.log(
    `${uniqueFileStats.length} files ${
      options.isDryRun ? "would be" : "will be"
    } ${mainActionLabelPast[options.mainAction.toString()]}`
  );

  console.debug({
    uniqueFileStats,
  });

  /* if (options.isDryRun) {
    consoleLog.info(`Dry Run mode (Abort)`);
    return;
  }*/

  //Empty folder rule (target folder)
  /*
  let isTargetDirectoryEmpty = await emptyDir(options.targetDirectory);
  if (!isTargetDirectoryEmpty) {
    consoleLog.info(`Target directory is not empty (Abort)`);
    return;
  }*/

  if (["copy", "move"].includes(options.mainAction)) {
    setTimeout(() => {
      sequential(
        uniqueFileStats.map((file: any) => {
          return async () => {
            let targetBasePath = options.targetDirectory;
            let targetFileName = file.newName || file.name;
            let targetPath = path.join(targetBasePath, targetFileName);

            if (options.targetDirectoryStructure === "flat") {
              if (!options.isDryRun) {
                if (options.mainAction === "copy") {
                  await sander
                    .copyFile(
                      file.fullname.split(file.name).join("") + file.newName ||
                        file.name
                    )
                    .to(targetPath);
                }
                if (options.mainAction === "move") {
                  await sander
                    .rename(file.path, file.name)
                    .to(targetBasePath, targetFileName);
                }
              }
            }
            if (options.targetDirectoryStructure !== "flat") {
              consoleLog.warn(
                `${options.targetDirectoryStructure} mode not implemented (Structure)`
              );
            }
            consoleLog.verbose(
              `${file.fullname} to ${targetPath} ${
                options.isDryRun
                  ? `(Would be ${mainActionLabelPast[
                      options.mainAction
                    ].toLowerCase()})`
                  : `(${mainActionLabelPast[options.mainAction]})`
              }`
            );
            win?.webContents.send("event", {
              processing: true,
            });
          }; //();
        })
      ).then(() => {
        consoleLog.info(
          `${mainActionLabelVerb[options.mainAction]} process ended`
        );
        win?.webContents.send("event", {
          processing: false,
        });
      });
    }, 1000);
  }

  return;
});

function getHTMLParagraph(text: String, title = "Info") {
  //consoleLog.log(`${title}: ${text}`);
  return `<p><strong>${title}:&nbsp;</strong>${text}.</p>`;
}

consoleLog.hooks.push((message: any, transport: any) => {
  if (transport === consoleLog.transports.console) {
    if (shouldSendConsoleEvent(message.level)) {
      win?.webContents.send("event", {
        html: getHTMLParagraph(message.data, message.level),
      });
    }
  }

  return message;
});

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
