import { app, BrowserWindow, shell, ipcMain } from "electron";
import { release } from "os";
import { join } from "path";
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
  });

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

ipcMain.handle("analyzeSources", async (event, sources = [], options = {}) => {
  console.log("analyzeSources", {
    sources,
    options,
  });

  let actions = [];

  //Empty folder rule (target folder)
  let isTargetDirectoryEmpty = await emptyDir(options.targetDirectory);

  if (!isTargetDirectoryEmpty) {
    actions.push({
      html: getHTMLParagraph(`Target directory is not empty`, "Abort"),
    });
    return { actions };
  }

  let readResults = await Promise.all(
    sources.map((sourcePath) => {
      return (async () => {
        //files
        return await rra.list(
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

  //List files to be copied/moved
  actions.push({
    html: getHTMLParagraph(`${files.length} files detected`),
  });
  actions.push({
    html: getHTMLParagraph(
      `${files.length - uniqueFiles.length} duplicated files will be ignored`
    ),
  });

  if (options.isDryRun) {
    actions.push({
      html: getHTMLParagraph(`Dry Run mode`, "Abort"),
    });
  }

  //Main action (copy / move)
  if (!options.isDryRun && options.mainAction === "copy") {
    if (options.mainAction !== "copy") {
      actions.push({
        html: getHTMLParagraph(
          `${options.mainAction} mode not implemented (mainAction)`,
          "Warning"
        ),
      });
    }

    setTimeout(() => {
      Promise.all(
        uniqueFiles.map((file: any) => {
          return (async () => {
            let targetPath = (file.fullname,
            options.targetDirectory + "/" + file.name)
              .split("//")
              .join("/");
            if (options.targetDirectoryStructure === "flat") {
              await sander.copyFile(file.fullname).to(targetPath);
            }
            if (options.targetDirectoryStructure !== "flat") {
              actions.push({
                html: getHTMLParagraph(
                  `${options.targetDirectoryStructure} mode not implemented (Structure)`,
                  "Warning"
                ),
              });
            }
            win?.webContents.send("event", {
              html: getHTMLParagraph(`${targetPath} (Copied)`),
              processing: true,
            });
          })();
        })
      ).then(() => {
        win?.webContents.send("event", {
          html: getHTMLParagraph("Copy process ended"),
          processing: false,
        });
      });
    }, 1000);
  }

  //console.log(files);
  return { actions };
});

function getHTMLParagraph(text: String, title = "Info") {
  console.log(`${title}: ${text}`);
  return `<p><strong>${title}:&nbsp;</strong>${text}.</p>`;
}
