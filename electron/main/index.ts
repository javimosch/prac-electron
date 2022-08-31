import { app, BrowserWindow, shell, ipcMain } from "electron";
import { release } from "os";
import { join } from "path";
import sequential from "./promiseSequence";
import moment from "moment-timezone";
const { shell } = require("electron");
const log = require("electron-log");
log.catchErrors({
  showDialog: true,
});
Object.assign(console, log.functions);

const path = require("path");
const cfg = require("electron-cfg");
const md5File = require("md5-file");
const emptyDir = require("empty-dir");
const sander = require("sander");
const isProduction = process.env.NODE_ENV === "production";
//quire("amd-loader");
//var readfiles = require("node-readfiles");
import * as rra from "recursive-readdir-async";

let logLevel = "normal";

let mainActionLabelVerb = {
  copy: "Copy",
  move: "Move",
};
let mainActionLabelPast = {
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

  res = await dialog.showOpenDialog(focusedWindow, {
    properties: ["openDirectory"],
  });

  return res.filePaths;
});

ipcMain.handle("openLogsFolder", async () => {
  shell.showItemInFolder(cfg.resolveUserDataPath("logs/main.log"));
});
ipcMain.handle("analyzeSources", async (event, sources = [], options = {}) => {
  console.debug(
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
  logLevel = options.loggingLevel || logLevel;

  if (sources.length === 0) {
    console.error("Missing source paths");
    return;
  }

  if (!options.targetDirectory) {
    console.error("Missing target directory");
    return;
  }

  let currCfg = cfg.create(options.name || "default.json");

  let computedConfigId = JSON.stringify({
    sources,
    targetDirectory: options.targetDirectory,
  });
  let configId = currCfg.get("id", computedConfigId);
  let fileStats = currCfg.get("stats", []);
  let uniqueFileStats = currCfg.get("stats", []);
  let isAnalysisComplete = currCfg.get("analysis", false);

  let actions = [];

  if (configId != computedConfigId) {
    isAnalysisComplete = false;
  }

  if (fileStats.length === 0 && uniqueFileStats.length === 0) {
    isAnalysisComplete = false;
  }

  //Force analysis
  isAnalysisComplete = false;

  if (!isAnalysisComplete) {
    console.verbose("Running analysis");
    //Analysis start

    let readResults = await sequential(
      sources.map((sourcePath) => {
        return async () => {
          //files
          let files = await rra.list(
            sourcePath,
            {
              mode: rra.LIST,
              recursive: true,
              stats: true,
              ignoreFolders: true,
              extensions: false,
              deep: true,
              realPath: true,
              normalizePath: true,
              include: options.include || [],
              //exclude: [],
              readContent: false,
              //encoding: 'base64'
            },
            function (obj, index, total) {
              if (obj.isDirectory) {
                return;
              }
              //console.log("File found", obj);
            }
          );
          return files.map((f) => {
            f.sourcePath = sourcePath;
            return f;
          });
        }; //();
      })
    );
    //console.debug(readResults);
    let files = readResults.reduce((a, v) => {
      a = [...a, ...v];
      return a;
    }, []);

    await sequential(
      files.map((file: any) => {
        return async () => {
          //grab md5
          let md5 = file.md5 || (await md5File(file.fullname));
          file.md5 = md5;
        }; //();
      })
    );

    files.forEach((file, index) => {
      file.duplicates = files
        .filter((v, i) => i !== index)
        .filter((f) => f.md5 == file.md5)
        .map((f) => f.fullname);
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
    await sequential(
      filesInTargetDir.map((file: any) => {
        return async () => {
          let md5 = file.md5 || (await md5File(file.fullname));
          file.md5 = md5;
        }; //();
      })
    );

    console.info(`${files.length} files detected in source directories`);

    let uniqueFiles = files.filter(
      (f, i) => files.findIndex((ff) => ff.md5 == f.md5) == i
    );
    let duplicatedFiles = files.filter(
      (f, i) => !uniqueFiles.some((ff) => ff.fullname == f.fullname) //TODO use unique identifier
    );
    duplicatedFiles.forEach((f, i) => {
      console.verbose(`[${i}] ${f.name} / ${f.md5} duplicated (Skip)`);
    });
    console.info(
      `${uniqueFiles.length} unique files detected (After checking duplicates in source directories)`
    );
    let existingFilesInTargetDir = uniqueFiles.filter(
      (f) => filesInTargetDir.findIndex((ff) => ff.md5 == f.md5) >= 0
    );
    currCfg.set("existingFilesInTargetDir", existingFilesInTargetDir);
    //filter out existing files in target dir
    uniqueFiles = uniqueFiles.filter((f, i) => {
      let r = !existingFilesInTargetDir.some((ff) => ff.md5 == f.md5);
      return r;
    });
    existingFilesInTargetDir.forEach((f, i) => {
      console.verbose(
        `[${i}] ${f.name} / ${f.md5} found in target directory (Skip) `
      );
    });
    console.info(
      `${existingFilesInTargetDir.length} files which already exists in target directory will be skip`
    );

    //If "move", remove skipped files from sources
    if (options.mainAction === "move") {
      Promise.all(
        existingFilesInTargetDir.map((f) => {
          return (async () => {
            if (!options.isDryRun) {
              sander.rimraf(f.fullname);
              console.verbose(
                `${f.fullname} (Skipped file removed from sources)`
              );
            } else {
              console.verbose(
                `${f.fullname} (Skipped file would be removed from sources)`
              );
            }
          })();
        })
      ).then(() => {
        console.info(
          `${existingFilesInTargetDir.length} skipped files ${
            options.isDryRun ? "should have been" : "were"
          } removed from sources (Because already exists in target directory)`
        );
      });
    }

    console.info(
      `${uniqueFiles.length} unique files detected (After checking duplicates in target directory)`
    );

    fileStats = files;
    uniqueFileStats = uniqueFiles;
  } else {
    console.verbose("Restoring analysis");
  }

  //Analysis complete
  isAnalysisComplete = true;
  currCfg.set("analysis", isAnalysisComplete);
  currCfg.set("fileStats", fileStats);
  currCfg.set("uniqueFileStats", uniqueFileStats);
  currCfg.set("timestamp", moment()._d.getTime());
  currCfg.set("date", moment().format("YYYY-MM-DD HH:mm:ss"));
  //=====

  console.log(
    `${uniqueFileStats.length} files ${
      options.isDryRun ? "would be" : "will be"
    } ${mainActionLabelPast[options.mainAction]}`
  );

  /* if (options.isDryRun) {
    console.info(`Dry Run mode (Abort)`);
    return;
  }*/

  //Empty folder rule (target folder)
  /*
  let isTargetDirectoryEmpty = await emptyDir(options.targetDirectory);
  if (!isTargetDirectoryEmpty) {
    console.info(`Target directory is not empty (Abort)`);
    return;
  }*/

  if (["copy", "move"].includes(options.mainAction)) {
    setTimeout(() => {
      sequential(
        uniqueFileStats.map((file: any) => {
          return async () => {
            let targetBasePath = options.targetDirectory;
            let targetFileName = file.name;
            let targetPath = path.join(targetBasePath, targetFileName);

            if (options.targetDirectoryStructure === "flat") {
              if (!options.isDryRun) {
                if (options.mainAction === "copy") {
                  await sander.copyFile(file.fullname).to(targetPath);
                }
                if (options.mainAction === "move") {
                  await sander
                    .rename(file.path, file.name)
                    .to(targetBasePath, targetFileName);
                }
              }
            }
            if (options.targetDirectoryStructure !== "flat") {
              console.warn(
                `${options.targetDirectoryStructure} mode not implemented (Structure)`
              );
            }
            console.verbose(
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
        console.info(
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
  //console.log(`${title}: ${text}`);
  return `<p><strong>${title}:&nbsp;</strong>${text}.</p>`;
}

log.hooks.push((message, transport) => {
  if (transport === log.transports.console) {
    if (shouldSendConsoleEvent(message.level)) {
      win?.webContents.send("event", {
        html: getHTMLParagraph(message.data, message.level),
      });
    }
  }

  return message;
});

function shouldSendConsoleEvent(level) {
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
