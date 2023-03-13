<template lang="pug">
div
  .main
    //.center(v-show="isDedupe||isClean")
    ResultStat(title="Count" :value="originalCount")
    ResultStat(title="Size" :value="originalSize")
    ResultStat(title="Final count" :value="finalCount")
    ResultStat(title="Final size" :value="finalSize")
  .main(style="margin-top:15px")
    ResultStat(title="Reclaimed" :value="reclaimedSize" block)

  //.center(v-show="isCopy")
      ResultStat(title="Copy count" :value="copyCount")
      ResultStat(title="Copy size" :value="copySize")
      ResultStat(title="Dedupe count" :value="dedupeCount")
      ResultStat(title="Dedupe size" :value="dedupeSize")
      ResultStat(title="Original target count" :value="originalCount")
      ResultStat(title="Original target size" :value="originalSize")
      ResultStat(title="Final target count" :value="finalCount")
      ResultStat(title="Final target size" :value="finalSize")
      
      //ResultStat(
        v-show="dupesCount"
        title="Duplicates" :value="dupesCount")
      //ResultStat(title="Freed space" :value="freedSizeFormatted")
  //BigButton(@click="finish") Go Back
</template>
<script setup>
import { inject, computed } from "vue";
import { PrakStateSymbol } from "@/constants.js";
//import { storeToRefs } from "pinia";
//import { useAppStore } from "@/stores/app";

//const appStore = useAppStore();
//const {  } = storeToRefs(appStore);
const state = inject(PrakStateSymbol);
const emit = defineEmits(["gotoStep"]);



function finish() {
  //status.value='analysis_required'
  state.reset.value();
  emit("gotoStep", "AnalysisView");
}

let isDedupe = computed({
  get: () => state.mainAction.value === "dedupe",
});
let isClean = computed({
  get: () => state.mainAction.value === "clean",
});
let isCopy = computed({
  get: () => state.mainAction.value === "copy",
});

let originalCount = computed({
  get: () => state.resultStats.value.originalCount || 0,
});
let originalSize = computed({
  get: () => formatBytes(state.resultStats.value.originalSize || 0),
});

let reclaimedSize= computed({
  get:()=> formatBytes((state.resultStats.value.originalSize||0) - (state.resultStats.value.finalSize||0))
})

let finalCount = computed({
  get: () => state.resultStats.value.finalCount || 0,
});
let finalSize = computed({
  get: () => formatBytes(state.resultStats.value.finalSize || 0),
});

let dedupeCount = computed({
  get: () => state.resultStats.value.dedupeCount || 0,
});
let dedupeSize = computed({
  get: () => formatBytes(state.resultStats.value.dedupeSize || 0),
});

let copyCount = computed({
  get: () => state.resultStats.value.copyCount || 0,
});
let copySize = computed({
  get: () => formatBytes(state.resultStats.value.copySize || 0),
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
.main {
  display: flex;
    justify-content: space-between;
    row-gap: 10px;
    flex-wrap: wrap;
    column-gap: 20px;
}
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 20px;
}
</style>
