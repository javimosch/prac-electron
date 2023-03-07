import { defineStore } from "pinia";
import {ref} from 'vue'
export const useAppStore = defineStore("app", () => {
  const currentViewName = ref("StepOneView");

  const brandSubtitle = ref('')

  const appVersion = ref('')
  window.electronAPI.customAction({
    name: "getAppVersion"
  }).then(version => appVersion.value=version)

  return { currentViewName, brandSubtitle, appVersion };
});
