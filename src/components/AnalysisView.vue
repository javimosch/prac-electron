<script setup>
import LoggingLevels from "./LoggingLevels.vue";
import { ref, inject, computed, onMounted, onUnmounted, watch } from "vue";
import { CleaningServicesOutlined, SettingsTwotone } from "@vicons/material";
import { Icon } from "@vicons/utils";
import {
  NSpace,
  NButton,
  NDivider,
  NForm,
  NFormItem,
  NInput,
  NRadioGroup,
  NRadioButton,
  NTooltip,
  NPopconfirm,
  NSpin,
  NAlert,
} from "naive-ui";
import { useLoadingBar } from "naive-ui";
import moment from "moment";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";
import { PrakStateSymbol } from "@/constants.js";

const appStore = useAppStore();
const { brandSubtitle } = storeToRefs(appStore);

const {
  sourceFolders,
  targetDirectory,
  outputResult,
  extensions,
  status,
  mainAction,
  isDryRun,
  targetDirectoryStructure,
  hasAnalysisCache,
  processingPercent,
  loggingLevel,
  isCopySettingsAreaVisible,
} = inject(PrakStateSymbol);

const stats = ref({
  targetStats: [],
  sourceStats: [],
});

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const emit = defineEmits(["gotoStep"]);

const loadingBar = useLoadingBar();

let isLoading = ref(false);

/*
watch(
  () => formValue.value.targetDirectoryStructure,
  (currV, oldV) => {
    if (currV == "preserve") {
      formValue.value.targetDirectoryMergeStrategy = "manual";
    }
  }
);*/
let unbindOnEvent;
onMounted(() => {
  brandSubtitle.value = "Run Analysis";

  unbindOnEvent = window.electronAPI.onAnalysisStat((message) => {
    Object.keys(stats.value).forEach((key) => {
      if (message[key] !== undefined) {
        stats.value[key] = message[key];
      }
    });
  });

  if (canRunAnalysis) {
    executeAnalysis(true);
  }
});
onUnmounted(() => {
  unbindOnEvent();
});

function cleanAnalysisCache() {
  window.electronAPI.customAction({
    name: "cleanAnalysisCache",
  });
}

function normalizeExtensions(extensions) {
  if (extensions.value.some((v) => v === "all")) {
    return [];
  }

  return extensions.value
    .map((v) => v)
    .filter((v) => !!v)
    .map((v) => `.` + v.split(".").join("").trim());
}

async function executeAnalysis(isAnalysis = false) {
  stats.value.sourceStats = [];
  stats.value.targetStats = [];
  loadingBar.start();
  isLoading.value = true;
  outputResult.value = "";
  if (isAnalysis) {
    status.value = "analysis_in_progress";
  }
  await window.electronAPI.analyzeSources([...sourceFolders.value], {
    isDryRun: isDryRun.value === true,
    loggingLevel: loggingLevel.value,
    mainAction: mainAction.value,
    isAnalysis,
    targetDirectoryStructure: targetDirectoryStructure.value,
    targetDirectory: targetDirectory.value[0],
    include: normalizeExtensions(extensions),
  });
  isLoading.value = false;
  if (isAnalysis) {
    status.value = "analysis_complete";
  }
  loadingBar.finish();
  //outputResult.value = actions.map((action) => action.html).join("");
}

async function executeMainAction(actionName) {
  mainAction.value = actionName;
  await executeAnalysis(false);
  //emit("gotoStep", "ProcessingView");
}

let isAnalysisInProgress = computed({
  get: () => status.value === "analysis_in_progress",
});
let isAnalysisComplete = computed({
  get: () => status.value === "analysis_complete",
});

let canSwitchView = computed({
  get: () => status.value !== "analysis_in_progress" && !isLoading.value,
});

let canRunAnalysis = computed({
  get: () => {
    return (
      isAnalysisInProgress.value === false &&
      isLoading.value == false &&
      sourceFolders.value.length > 0 &&
      targetDirectory.value.length > 0 &&
      extensions.value.length > 0
    );
  },
});

let canRunMainAction = computed({
  get: () => {
    return (
      isAnalysisComplete.value === true && //Has comple analysis
      isLoading.value == false && //Is not loading
      sourceFolders.value.length > 0 && //Has selected source folders
      (targetDirectory.value.length > 0 || mainAction.value === "dedupe") &&
      extensions.value.length > 0 && //Has extensions
      stats.value.sourceStats.length > 0 //There are files in sourceFolders
    );
  },
});
</script>

<template lang="pug">
//StepZeroBar(@click="canSwitchView&& $emit('gotoStep','StartView')" :style="canSwitchView?'cursor:pointer':''")
//StepOneBar(@click="canSwitchView&&$emit('gotoStep','SourceTargetView')" :style="canSwitchView?'cursor:pointer':''")
Layout
  .h-layout
    .left-layout
      
      .grid-h-50(style="margin-bottom:50px;")
        div
          SourceFoldersSelector
        div
          ExtensionsSelect
      
      AnalysisExtensionsStats(:stats="stats.sourceStats")

      //div
        label Source
        AnalysisStat(title="Files found" :value="stats.sourceFileCount")
        AnalysisStat(title="Size" :value="formatBytes(stats.sourceFilesSizeTotal)")
        label Target
        AnalysisStat(title="Files found" :value="43")
        AnalysisStat(title="Size" :value="1.5")
    .right-layout

      .two-buttons
        .two-buttons
          n-tooltip( trigger="hover"      )
            template(#trigger)
              BigButton(fullWidth style="margin-top:15px" borderColor="grey" color="white"
                :disabled="!canRunAnalysis"
                @click="canRunAnalysis && executeAnalysis(true)"
                ) 
                  span(v-show="!isAnalysisComplete") Run Analysis
                  span(v-show="isAnalysisComplete") Re-Run Analysis
                  //NSpin(
                    v-show="isAnalysisInProgress"
                    size="large")
            p Run analysis and collect files information.
          div(v-show="hasAnalysisCache")
            n-tooltip( trigger="hover"      )
              template(#trigger)
                BigButton.sm( borderColor="grey" color="white" style="margin-top:15px"
                @click="cleanAnalysisCache()"
                )
                  Icon(size="30" color="white")
                    CleaningServicesOutlined
              p Clear analysis cache
        
        .two-buttons(v-if="mainAction==='copy'")
          n-tooltip(trigger="hover")
            template(#trigger)
              BigButton(style="margin-top:15px" borderColor="grey" color="white" @click="canRunMainAction&&executeMainAction('copy')"
              :disabled="!canRunMainAction"
              ) COPY
            p Sync/Copy to target (Deduping and skipping existing files)
          
          n-tooltip( trigger="hover"      )
            template(#trigger)
              BigButton.sm( borderColor="grey" color="white" style="margin-top:15px"
              @click="()=>canRunMainAction ? isCopySettingsAreaVisible=true : null" :disabled="!canRunMainAction"
              )
                Icon(size="30" color="white")
                  SettingsTwotone
            p Copy settings area


        n-tooltip(v-if="mainAction==='clean'" trigger="hover"      )
          template(#trigger)
            BigButton(style="margin-top:15px" borderColor="grey" color="white" @click="canRunMainAction&&executeMainAction('clean')" :disabled="!canRunMainAction") CLEAN
          p Free space removing source files present in Target directory and duplicates.

        n-tooltip(v-if="mainAction==='dedupe'" trigger="hover"      )
          template(#trigger)

            BigButton(
              bgColor="var(--dark)"
              fullWidth style="margin-top:15px" borderColor="grey" color="white" @click="canRunMainAction&&executeMainAction('dedupe')" :disabled="!canRunMainAction") De-dupe
          p Remove duplicates in the selected directories
        
    
      ResultInfos(style="margin-top:50px")

      .copy-wrapper(v-if="mainAction!=='dedupe'")
        label Target  
        AnalysisExtensionsStats(:stats="stats.targetStats")
      //n-tooltip( trigger="hover"      )
        template(#trigger)
          NormalButton(style="margin-top:15px" borderColor="grey" color="black" @click="()=>{}" :disabled="true") DEDUPE
        p Free space deduping in target directory
      
  LoadingBar.loading-bar(v-show="processingPercent!==0&&processingPercent!==100" :percent="processingPercent")       
  //OverviewText 
</template>
<style lang="scss" scoped>

.grid-h-50{
  display:grid;
  grid-template-columns: 1fr 1fr;
  &>div{
    padding:10px;
  }
}

.h-layout {
  display: grid;
  margin-top: 20px;
  grid-template-columns: 1fr 33.33%;
}
.left-layout {
  flex-basis: 50%;
  display: flex;
  flex-direction: column;
  row-gap: 5px;
}
.right-layout {
  flex-basis: 50%;
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  justify-content: center;
    align-items: center;
}
.extra-options {
  display: flex;
  column-gap: 10px;
}
label {
  font-weight: 300;
  font-size: 16px;
}
.two-buttons {
  display: flex;
  row-gap: 5px;
  flex-direction: column;
}
span {
  white-space: nowrap;
}
.loading-bar {
  margin-top: 50px;
  margin-bottom: 50px;
}
</style>
