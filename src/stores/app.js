import { defineStore } from "pinia";
import {ref} from 'vue'
export const useAppStore = defineStore("app", () => {
  

  

  const appVersion = ref('')
  window.electronAPI.customAction({
    name: "getAppVersion"
  }).then(version => appVersion.value=version)

  const appSettingsRef = ref({})
  trpc.getAppSettings.query().then(appSettings =>appSettingsRef.value=appSettings)

  const versionExpirationRef = ref(null)

  return { appVersion, appSettingsRef, versionExpirationRef };
});
