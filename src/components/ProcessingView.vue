<template lang="pug">
.steps
    StepZeroBar(@click="$emit('gotoStep','StartView')")
    StepOneBar(@click="$emit('gotoStep','SourceTargetView')")
    StepTwoBar(@click="$emit('gotoStep','AnalysisView')")
    .main
        .center
            ResultStat(title="Processed files" :value="filesCount")
            ResultStat(
              v-show="dupesCount"
              title="Duplicates" :value="dupesCount")
            ResultStat(title="Freed space" :value="freedSizeFormatted")
        BigButton(@click="finish") Go Back
    </template>
<script setup>
import {inject, computed} from "vue"
import { PrakStateSymbol } from "@/constants.js";

const state = inject(PrakStateSymbol);
const emit = defineEmits(['gotoStep'])
function finish(){
  //status.value='analysis_required'
  state.reset.value()
  emit('gotoStep','AnalysisView')
}

let freedSizeFormatted = computed({
  get: () => formatBytes(state.resultStats.value.freedSize||0)
});

let filesCount = computed({
  get: () => state.resultStats.value.filesCount||0
});

let dupesCount = computed({
  get: () => state.resultStats.value.dupesCount||0
});

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

</script>
<style scoped>
.steps {
  display: flex;
  justify-content: flex-start;
}

.main {
  padding: 20px;
  background-color: var(--orange);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 20px;
  width: calc(100vw - 200px);
  min-height: calc(100vh - 40px);
}
.center{
    display:flex;
    column-gap: 10px;
}
</style>
