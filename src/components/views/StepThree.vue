<script setup>
//import LoggingLevels from "./LoggingLevels.vue";
import { ref, inject, computed, onMounted, onUnmounted, watch } from "vue";
import { CleaningServicesOutlined, SettingsTwotone } from "@vicons/material";
import { Icon } from "@vicons/utils";
import * as analytics from "@/analytics.js";
import useLoadingBar from "@/composables/loading-bar";
//import { storeToRefs } from "pinia";
//import { useAppStore } from "@/stores/app";
import { PrakStateSymbol } from "@/constants.js";
import { extData } from "@/components/ExtensionsSelect.vue";
//const appStore = useAppStore();
//const {  } = storeToRefs(appStore);

import useHotkey from "vue3-hotkey";

const hotkeys = ref([
  {
    keys: ["Escape"],
    preventDefault: true,
    handler(keys) {
      
      modal.value = false;
    },
  },
]);
const stopHotKeys = useHotkey(hotkeys.value);

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
  removePriority,
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
  unbindOnEvent = window.electronAPI.onAnalysisStat((message) => {
    Object.keys(stats.value).forEach((key) => {
      if (message[key] !== undefined) {
        stats.value[key] = message[key];
      }
    });
  });

  if (canRunAnalysis) {
    //executeAnalysis(true);
  }
});
onUnmounted(() => {
  
  try{
    (stopHotKeys||[]).forEach(s=>s())
  }catch(err){}

  unbindOnEvent();
});

function cleanAnalysisCache() {
  window.electronAPI.customAction({
    name: "cleanAnalysisCache",
  });
}

function normalizeExtensions(extensions) {
  if (extensions.value.some((v) => v === "all")) {
    return extData.extensions.filter((ext) => ext !== "all");
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

  let options = {
    isDryRun: isDryRun.value === true,
    loggingLevel: loggingLevel.value,
    mainAction: mainAction.value,
    removePriority: removePriority.value,
    isAnalysis,
    targetDirectoryStructure: targetDirectoryStructure.value,
    targetDirectory: targetDirectory.value[0],
    include: normalizeExtensions(extensions),
  };

  await window.electronAPI.analyzeSources([...sourceFolders.value], options);

  analytics.trackAction("execute", {
    type: isAnalysis ? "scan" : options.mainAction,
    options,
    stats: { ...stats.value },
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

const handleRemovePriorityChange = (e) => {
  removePriority.value = e.target.value;
};
const modal = ref(false);
const json = ref([]);
const jsonSearch = ref("")
const jsonWillRemove = ref(false)
const filteredJson = computed(()=>{
  return json.value.filter(item=>{
    if(item.willRemove!==jsonWillRemove.value){
      return false
    }
    return !jsonSearch.value || item.file.toLowerCase().includes(jsonSearch.value)
  })
})
async function onClickRow(stat) {
  modal.value = true;

  let files = await window.electronAPI.customAction({
    name: "getSourceFiles",
    ext: stat.ext
  });
  console.log({
    stat,
    files
  })
  json.value = files
}
</script>

<template lang="pug">
//StepZeroBar(@click="canSwitchView&& $emit('gotoStep','StartView')" :style="canSwitchView?'cursor:pointer':''")
//StepOneBar(@click="canSwitchView&&$emit('gotoStep','SourceTargetView')" :style="canSwitchView?'cursor:pointer':''")
Modal(v-show="modal" @clickOverlay="()=>modal=false")
  input(v-model="jsonSearch" placeholder="Contains...")
  div
    label Will remove
    input(type="checkbox" v-model="jsonWillRemove")
  p Filtered files: {{filteredJson.length}}
  JSONViewer(v-model="filteredJson")
Layout
  .h-layout
    
    .left-layout
      LoadingBar.loading-bar( :percent="processingPercent")         
      .grid-h-50(style="margin-bottom:20px;")
        div
          SourceFoldersSelector
        div
          ExtensionsSelect
      
      AnalysisExtensionsStats(:stats="stats.sourceStats" @clickRow="onClickRow")

      //div
        label Source
        AnalysisStat(title="Files found" :value="stats.sourceFileCount")
        AnalysisStat(title="Size" :value="formatBytes(stats.sourceFilesSizeTotal)")
        label Target
        AnalysisStat(title="Files found" :value="43")
        AnalysisStat(title="Size" :value="1.5")
    .right-layout

      SecondaryButton(
        title="Scan and collect files information."
        fullWidth  borderColor="grey" color="white"
        :disabled="!canRunAnalysis"
        @click="canRunAnalysis && executeAnalysis(true)"
        ) 
          span(v-show="!isAnalysisComplete") Scan
          span(v-show="isAnalysisComplete") Re-Scan

      SecondaryButton(
          title="Remove duplicates in the selected directories"
          bgColor="var(--dark)"
          fullWidth style="margin-top:15px" borderColor="grey" color="white" @click="canRunMainAction&&executeMainAction('dedupe')" :disabled="!canRunMainAction") De-dupe

      .two-buttons
        .two-buttons
          
          
          
          //div(v-show="hasAnalysisCache")
            
            PrimaryButton.sm(
                  title="Clear analysis cache"
                   borderColor="grey" color="white" style="margin-top:15px"
                @click="cleanAnalysisCache()"
                )
                  Icon(size="30" color="white")
                    CleaningServicesOutlined
            
        
        .two-buttons(v-if="mainAction==='copy'")
          
          PrimaryButton(
                title="Sync/Copy to target (Deduping and skipping existing files)"
                style="margin-top:15px" borderColor="grey" color="white" @click="canRunMainAction&&executeMainAction('copy')"
              :disabled="!canRunMainAction"
              ) COPY
          
          
          PrimaryButton.sm(
                title="Copy settings area"
                 borderColor="grey" color="white" style="margin-top:15px"
              @click="()=>canRunMainAction ? isCopySettingsAreaVisible=true : null" :disabled="!canRunMainAction"
              )
                Icon(size="30" color="white")
                  SettingsTwotone


        //PrimaryButton(
              title="Free space removing source files present in Target directory and duplicates."
              style="margin-top:15px" borderColor="grey" color="white" @click="canRunMainAction&&executeMainAction('clean')" :disabled="!canRunMainAction") CLEAN
        

       
        
      div
        input(type="radio" @change="handleRemovePriorityChange" name="removePriority" :checked="removePriority==='CLOSER_TO_ROOT'" value="CLOSER_TO_ROOT")
        label Remove the files closer to the root directory.
      div
        input(type="radio" @change="handleRemovePriorityChange" name="removePriority" :checked="removePriority==='FAR_FROM_ROOT'" value="FAR_FROM_ROOT"
        )
        label Remove the files far from the root directory. 

      .result-infos-wrapper
        ResultInfos(style="margin-top:45px")

      .copy-wrapper(v-if="mainAction!=='dedupe'")
        label Target  
        AnalysisExtensionsStats(:stats="stats.targetStats")
      
  
  //OverviewText 
</template>
<style lang="scss" scoped>
.grid-h-50 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
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

  align-items: center;
  padding-left: 25px;
  padding-right: 5px;
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
.result-infos-wrapper {
  display: flex;
  justify-content: center;
  width: 300px;
  justify-self: center;
}
</style>
