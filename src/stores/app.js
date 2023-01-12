import { defineStore } from "pinia";
import {ref} from 'vue'
export const useAppStore = defineStore("app", () => {
  const currentViewName = ref("StartView");

  const brandSubtitle = ref('')

  return { currentViewName, brandSubtitle };
});
