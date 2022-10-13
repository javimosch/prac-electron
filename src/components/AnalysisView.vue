<script setup>
import LoggingLevels from "./LoggingLevels.vue";
import { ref, inject, computed, onMounted, onUnmounted, watch } from "vue";
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
import { PrakStateSymbol } from "../constants.js";
import { useLoadingBar } from "naive-ui";
import moment from "moment";
const {
  sourceFolders,
  targetDirectory,
  outputResult,
  isOutputAreaVisible,
  extensions,
  status,
  mainAction,
  targetDirectoryStructure,
} = inject(PrakStateSymbol);

const stats = ref({
  sourceFileCount:0,
  sourceFilesSizeTotal:0
})

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const emit = defineEmits(['gotoStep'])

let loggingLevel = ref("verbose");

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
let unbindOnEvent
onMounted(()=>{
  unbindOnEvent = window.electronAPI.onAnalysisStat((message) => {
      console.log('onAnalysisStat',{
        message
      })
      Object.keys(stats.value).forEach(key=>{
        if(message[key]!==undefined){
          stats.value[key]=message[key]
        }
      })
     
    });
})
onUnmounted(()=>{
  unbindOnEvent();
})



function normalizeExtensions(extensions) {
  if (extensions.value.some((v) => v.value === "all")) {
    return [];
  }

  return extensions.value
    .map((v) => v.value)
    .filter((v) => !!v)
    .map((v) => `.` + v.split(".").join("").trim());
}

function openLogsFolder() {
  isOutputAreaVisible.value = true;
  window.electronAPI.openLogsFolder();
}
async function executeAnalysis(isDryRun = false) {
  loadingBar.start();
  isLoading.value = true;
  outputResult.value = "";
  if (isDryRun) {
    status.value = "analysis_in_progress";
  }
  await window.electronAPI.analyzeSources([...sourceFolders.value], {
    isDryRun: isDryRun === true,
    loggingLevel: loggingLevel.value,
    mainAction: mainAction.value,
    targetDirectoryStructure: targetDirectoryStructure.value,
    targetDirectory: targetDirectory.value[0],
    include: normalizeExtensions(extensions),
  });
  isLoading.value = false;
  if (isDryRun) {
    status.value = "analysis_complete";
  }
  loadingBar.finish();
  //outputResult.value = actions.map((action) => action.html).join("");
}

async function executeMainAction(actionName){
  mainAction.value = actionName;
  executeAnalysis(false)
  emit('gotoStep','ProcessingView')
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
      isAnalysisInProgress.value===false &&
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
      isAnalysisComplete.value===true &&
      isLoading.value == false &&
      sourceFolders.value.length > 0 &&
      targetDirectory.value.length > 0 &&
      extensions.value.length > 0
    );
  },
});
</script>

<template lang="pug">
.steps
  StepZeroBar(@click="canSwitchView&& $emit('gotoStep','StartView')" :style="canSwitchView?'cursor:pointer':''")
  StepOneBar(@click="canSwitchView&&$emit('gotoStep','SourceTargetView')" :style="canSwitchView?'cursor:pointer':''")
  .main
    StepTitle
      | Analysis
    .h-layout
      .left-layout
        label Source
        AnalysisStat(title="Files found" :value="stats.sourceFileCount")
        AnalysisStat(title="Size" :value="formatBytes(stats.sourceFilesSizeTotal)")
        label Target
        AnalysisStat(title="Files found" :value="43")
        AnalysisStat(title="Size" :value="1.5")
      .right-layout
        AnalysisExtensionsStats
        
        
        
        NormalButton(style="margin-top:15px" borderColor="grey" color="black"
        :disabled="!canRunAnalysis"
        @click="canRunAnalysis && executeAnalysis(true)"
        ) 
          span(v-show="!isAnalysisComplete") Analysis
          span(v-show="isAnalysisComplete") Analysis again
          n-spin(
            v-show="isAnalysisInProgress"
            size="large")
        
        
        NormalButton(style="margin-top:15px" borderColor="grey" color="black" @click="canRunMainAction&&executeMainAction('copy')"
        :disabled="!canRunMainAction"
        ) COPY TO DESTINATION
        
        NormalButton(style="margin-top:15px" borderColor="grey" color="black" @click="canRunMainAction&&executeMainAction('clean')" :disabled="!canRunMainAction") CLEAN SOURCE

        NormalButton(style="margin-top:15px" borderColor="grey" color="black" @click="openLogsFolder") Open Logs folder
        
        .extra-options
          div(style="margin-top:10px;")
            label Logging Level
            LoggingLevels(v-model="loggingLevel")
          div(style="margin-top:10px;")
            TargetStructureSelect
            
        
    OverviewText 
  StepThreeBar  
   
</template>
<style scoped>
.steps {
  display: flex;
  justify-content: flex-start;
}

.main {
  padding: 20px;
  background-color: var(--sand);
  display: flex;
  flex-direction: column;
  justify-content: start;
  row-gap: 20px;
  min-height: calc(100vh - 40px);
  width: calc(100vw - 200px);
}

.center {
  background-color: var(--sand);
  display: flex;
  flex-direction: column;
}
.h-layout {
  display: flex;
  margin-top: 20px;
  column-gap: 50px;
}
.left-layout {
  flex-basis: 40%;
  display: flex;
  flex-direction: column;
  row-gap: 25px;
}
.right-layout {
  flex-basis: 70%;
}
.extra-options {
  display: flex;
  column-gap: 10px;
}
label{
  font-family: 'Lato', sans-serif;
  font-weight:300;
  font-size:16px;
}
</style>
