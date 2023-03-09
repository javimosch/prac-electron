import { Directus } from "@directus/sdk";
import * as xhr2 from "xhr2";
global.XMLHttpRequest = xhr2;
export default async function testDirectus() {
  const {getAppVersion} = this
  const directus = new Directus("https://prakdb.intrane.fr");

  const appVersion = await getAppVersion()
  // AUTHENTICATION

  let authenticated = false;

  // Try to authenticate with token if exists
  await directus.auth
    .refresh()
    .then(() => {
      authenticated = true;
    })
    .catch(() => {});

  // Let's login in case we don't have token or it is invalid / expired

  const email = "prakapp@prakapp.com";
  const password = "prakapp";

  await directus.auth
    .login({ email, password })
    .then(() => {
      authenticated = true;
      console.log("directus auth success");
    })
    .catch(() => {
      console.log("directus auth fail");
    });

    console.log("directus test",{
        appVersion
    });
  // GET DATA

  // After authentication, we can fetch data from any collections that the user has permissions to.
  const privateData = await directus
    .items("app_version_expiration")
    .readByQuery({ sort: ["id"], filter:{
        version:{
            _eq: appVersion
        }
    } });

  console.log("directus res", {
    data: privateData.data,
  });
}
