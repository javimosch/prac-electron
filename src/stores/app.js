import { defineStore } from "pinia";
import {ref} from 'vue'
export const useAppStore = defineStore("app", () => {
  const currentViewName = ref("StepOneView");

  const brandSubtitle = ref('')

  return { currentViewName, brandSubtitle };
});
