import { defineStore } from "pinia";
import { ref } from "vue";
import { getAppVersionExpiration } from "@/api/client";

export const useAppStore = defineStore("app", () => {
  const appVersion = ref("");
  const versionExpirationRef = ref(null);
  window.electronAPI
    .customAction({
      name: "getAppVersion",
    })
    .then(async (version) => {
      console.log("geAppVersion", {
        version,
      });

      appVersion.value = version;

      if (!!appVersion.value) {
        let items = (await getAppVersionExpiration(appVersion.value)) || [];
        if (items.length > 0) {
          versionExpirationRef.value = items[0];
        } else {
          versionExpirationRef.value = {
            expiration:
              import.meta.env.VITE_COMPILED_AT * 1000 +
              1000 * 60 * 60 * 24 * 30,
          };
        }
        console.log("getAppVersionExpiration", {
          versionExpirationRef,
        });
      }
    });

  const appSettingsRef = ref({
    official_website_url: import.meta.env.VITE_OFFICIAL_WEBSITE_URL,
  });

  const enableConsole = ref(false);

  return { appVersion, appSettingsRef, versionExpirationRef, enableConsole };
});
