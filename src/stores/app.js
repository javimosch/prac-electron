import { defineStore } from "pinia";
import {ref} from 'vue'
export const useAppStore = defineStore("app", () => {
  const currentViewName = ref("StartView");

  return { currentViewName };
});
