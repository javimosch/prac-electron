import { app, BrowserWindow, shell, ipcMain } from "electron";
import { release } from "os";
import { join } from "path";
const { shell } = require("electron");
const log = require("electron-log");
log.catchErrors({
  showDialog: true,
});
Object.assign(console, log.functions);
const cfg = require("electron-cfg");
const md5File = require("md5-file");
const emptyDir = require("empty-dir");
const sander = require("sander");
const isProduction = process.env.NODE_ENV === "production";
//quire("amd-loader");
//var readfiles = require("node-readfiles");
import * as rra from "recursive-readdir-async";

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

  if (!isAnalysisComplete) {
    console.verbose("Running analysis");
    //Analysis start

    let readResults = await Promise.all(
      sources.map((sourcePath) => {
        return (async () => {
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
        })();
      })
    );
    let files = readResults.reduce((a, v) => {
      a = [...a, ...v];
      return a;
    }, []);

    await Promise.all(
      files.map((file: any) => {
        return (async () => {
          //grab md5
          let md5 = file.md5 || (await md5File(file.fullname));
          file.md5 = md5;
        })();
      })
    );

    files.forEach((file, index) => {
      file.duplicates = files
        .filter((v, i) => i !== index)
        .filter((f) => f.md5 == file.md5)
        .map((f) => f.fullname);
    });

    let uniqueFiles = files.filter(
      (f, i) => files.findIndex((ff) => ff.md5 == f.md5) == i
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
  //=====

  //List files to be copied/moved
  console.info(`${fileStats.length} files detected`);
  console.info(
    `${
      fileStats.length - uniqueFileStats.length
    } duplicated files will be ignored`
  );

  if (options.isDryRun) {
    console.info(`Dry Run mode (Abort)`);
    return;
  }

  //Empty folder rule (target folder)
  let isTargetDirectoryEmpty = await emptyDir(options.targetDirectory);
  if (!isTargetDirectoryEmpty) {
    console.info(`Target directory is not empty (Abort)`);
    return;
  }

  //Main action (copy / move)
  if (!options.isDryRun && options.mainAction === "copy") {
    if (options.mainAction !== "copy") {
      console.warn(`${options.mainAction} mode not implemented (mainAction)`);
    }

    setTimeout(() => {
      Promise.all(
        uniqueFileStats.map((file: any) => {
          return (async () => {
            let targetPath = (file.fullname,
            options.targetDirectory + "/" + file.name)
              .split("//")
              .join("/");
            if (options.targetDirectoryStructure === "flat") {
              await sander.copyFile(file.fullname).to(targetPath);
            }
            if (options.targetDirectoryStructure !== "flat") {
              console.warn(
                `${options.targetDirectoryStructure} mode not implemented (Structure)`
              );
            }
            console.verbose(`${targetPath} (Copied)`);
            win?.webContents.send("event", {
              processing: true,
            });
          })();
        })
      ).then(() => {
        console.info("Copy process ended");
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
    win?.webContents.send("event", {
      html: getHTMLParagraph(message.data, message.level),
    });
  }

  return message;
});
