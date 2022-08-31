import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config({
  silent: true,
});
import moment from "moment";
import { Octokit, App } from "octokit";
import * as rra from "recursive-readdir-async";
const path = require("path");
const log = console;

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

const sander = require("sander");
const fs = require("fs");
const express = require("express");
const app = express();
var serveIndex = require("serve-index");

app.use(express.json());

app.get("/webhook", (req, res) => {
  processLatestArtifact(req.body);
  res.status(200).json({ alive: true, message: "Queued" });
});
app.post("/webhook", (req, res) => {
  console.log({
    body: req.body,
  });
  processLatestArtifact(req.body);
  res.status(200).json({});
});

app.use("/", serveIndex(path.join(process.cwd(), "/")));
app.use("/", express.static(path.join(process.cwd(), "/")));

app.listen(3000, () => log.info("READY"));

//processArtifact("release_on_macos-latest_270822-023336.dmg");

async function processArtifact(saveFileName, downloadURL) {
  if (await isDmgAlreadyPresent(saveFileName)) {
    log.info("dmg is already present");
    await triggerN8nGoogleDriveUpload();
  } else {
    let alreadyDownloaded = await sander.exists(saveFileName);

    if (alreadyDownloaded) {
      log.info("Skip, already downloaded");
      await extractDmgFile(saveFileName);
      await triggerN8nGoogleDriveUpload();
    } else {
      await downloadZipFile(downloadURL, saveFileName);
      await extractDmgFile(saveFileName);
      await triggerN8nGoogleDriveUpload();
    }
  }
  removeOlderFiles(saveFileName);
}

async function removeOlderFiles(name) {
  let dmgFileName = name.split(".zip").join(".dmg");
  let files = await rra.list(process.cwd(), {
    mode: rra.LIST,
    recursive: false,
    stats: true,
    ignoreFolders: true,
    extensions: false,
    deep: true,
    realPath: true,
    normalizePath: true,
    include: [],
    //exclude: [],
    readContent: false,
    //encoding: 'base64'
  });

  if (files.length > 0) {
    await Promise.all(
      files
        .filter(
          (file) =>
            file.name != name &&
            file.name != dmgFileName &&
            (file.name.includes(".dmg") || file.name.includes(".zip"))
        )
        .map((file) => {
          return (async () => {
            if (process.env.ENABLE_RIMRAF === "1") {
              sander.rimraf(file.fullname);
              console.log("Will remove", file.name);
            } else {
              console.log("Should remove", file.name);
            }
          })();
        })
    );
    console.log("removeOlderFiles completed");
  } else {
    console.log("removeOlderFiles completed (Skip)");
  }
}

async function processLatestArtifact() {
  let apiRes = await octokit.request(
    "GET /repos/{owner}/{repo}/actions/artifacts",
    {
      owner: "javimosch",
      repo: "prac-electron",
    }
  );
  let artifactList = apiRes.data.artifacts;

  let currItem;
  let downloadURL = "";
  let artificatCreatedAt = null;

  artifactList
    .filter((item) => {
      return item.name.includes("macos") && item.expired === false;
    })
    .forEach((item) => {
      if (!artificatCreatedAt) {
        artificatCreatedAt = moment(item.created_at);
        downloadURL = item.archive_download_url;
        currItem = item;
      } else {
        if (moment(item.created_at).isAfter(artificatCreatedAt, "minute")) {
          artificatCreatedAt = moment(item.created_at);
          downloadURL = item.archive_download_url;
          currItem = item;
        }
      }
    });

  let saveFileName =
    currItem.name +
    "_" +
    moment(currItem.created_at).format("DDMMYY-HHmmss") +
    ".zip";

  log.info({
    downloadURL,
    saveFileName,
  });

  processArtifact(saveFileName, downloadURL);
}

async function triggerN8nGoogleDriveUpload() {
  log.info("triggerN8nGoogleDriveUpload not implemented");
}

async function isDmgAlreadyPresent(zipFilePath) {
  let dmgFileName = zipFilePath.split(".zip").join(".dmg");
  return await sander.exists(dmgFileName);
}

async function extractDmgFile(filePath) {
  let dmgFileName = filePath.split(".zip").join(".dmg");
  if (await isDmgAlreadyPresent(filePath)) {
    log.info("dmg is already present");
    return dmgFileName;
  }
  const unzipper = require("unzipper");
  const zip = fs
    .createReadStream(filePath)
    .pipe(unzipper.Parse({ forceStream: true }));
  for await (const entry of zip) {
    const fileName = entry.path;
    const type = entry.type; // 'Directory' or 'File'
    const size = entry.vars.uncompressedSize; // There is also compressedSize;
    if (fileName.includes(".dmg")) {
      entry
        .on("end", () => {
          log.info("Unzip complete");
        })
        .pipe(fs.createWriteStream(dmgFileName));
    } else {
      entry.autodrain();
    }
  }
  return dmgFileName;
}

function downloadZipFile(url, fileName) {
  return new Promise((resolve, reject) => {
    var request = require("request");
    var progress = require("request-progress");
    progress(
      request.get({
        url: url,
        headers: {
          "User-Agent": "",
          Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
      }),
      {
        // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms
        // delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms
        // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
      }
    )
      .on("progress", function (state) {
        // The state is an object that looks like this:
        // {
        //     percent: 0.5,               // Overall percent (between 0 to 1)
        //     speed: 554732,              // The download speed in bytes/sec
        //     size: {
        //         total: 90044871,        // The total payload size in bytes
        //         transferred: 27610959   // The transferred payload size in bytes
        //     },
        //     time: {
        //         elapsed: 36.235,        // The total elapsed seconds since the start (3 decimals)
        //         remaining: 81.403       // The remaining seconds to finish (3 decimals)
        //     }
        // }
        //log.info("progress", state);
        log.info("downloading", {
          ...state,
          computed: {
            elapsed: state.time.elapsed,
            speed: (state.speed / 1024 / 1024).toFixed(2) + "mb/s",
            completed: (state.size.transferred / 1024 / 1024).toFixed(2) + "mb",
          },
        });
      })
      .on("error", function (err) {
        // Do something with err
        log.info("request error", err);
      })
      .on("end", function () {
        // Do something after request finishes
        log.info("request end");
        resolve();
      })
      .pipe(fs.createWriteStream(fileName));
  });
}
