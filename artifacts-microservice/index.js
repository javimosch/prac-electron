import { createRequire } from "module";
import moment from "moment";
//import { Octokit, App } from "octokit";

const require = createRequire(import.meta.url);
const sander = require("sander");
const fs = require("fs");
const express = require("express");
const app = express();
var serveIndex = require("serve-index");
const path = require("path");
app.use(express.json());

app.use("/", serveIndex(path.join(process.cwd(), "/")));
app.use("/", express.static(path.join(process.cwd(), "/")));

app.post("/", async (req, res) => {
  let currItem;
  let downloadURL = "";
  let artificatCreatedAt = null;

  req.body
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

  console.log({
    downloadURL,
    saveFileName,
  });

  processArtifact(saveFileName, downloadURL);

  res.status(200).json({});
});
app.listen(3000, () => console.log("READY"));

//processArtifact("release_on_macos-latest_270822-023336.dmg");

async function processArtifact(saveFileName, downloadURL) {
  if (await isDmgAlreadyPresent(saveFileName)) {
    console.log("dmg is already present");
    triggerN8nGoogleDriveUpload();
  } else {
    let alreadyDownloaded = await sander.exists(saveFileName);

    if (alreadyDownloaded) {
      console.log("Skip, already downloaded");
      await extractDmgFile(saveFileName);
      triggerN8nGoogleDriveUpload();
    } else {
      await downloadZipFile(downloadURL, saveFileName);
      await extractDmgFile(saveFileName);
      triggerN8nGoogleDriveUpload();
    }
  }
}

async function triggerN8nGoogleDriveUpload() {}

async function isDmgAlreadyPresent(zipFilePath) {
  let dmgFileName = zipFilePath.split(".zip").join(".dmg");
  return await sander.exists(dmgFileName);
}

async function extractDmgFile(filePath) {
  let dmgFileName = filePath.split(".zip").join(".dmg");
  if (await isDmgAlreadyPresent(filePath)) {
    console.log("dmg is already present");
    return;
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
          console.log("Unzip complete");
        })
        .pipe(fs.createWriteStream(dmgFileName));
    } else {
      entry.autodrain();
    }
  }
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
          Authorization: "token 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",
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
        //console.log("progress", state);
        console.log("downloading", {
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
        console.log("request error", err);
      })
      .on("end", function () {
        // Do something after request finishes
        console.log("request end");
        resolve();
      })
      .pipe(fs.createWriteStream(fileName));
  });
}
