<script setup>
import LoggingLevels from "./LoggingLevels.vue";
import { ref, inject, computed, onMounted, onUnmounted, watch } from "vue";
import { CleaningServicesOutlined,SettingsTwotone } from '@vicons/material'
import { Icon } from '@vicons/utils'
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

import { PrakStateSymbol } from "@/constants.js";
const {
  sourceFolders,
  targetDirectory,
  outputResult,
  extensions,
  status,
  mainAction,
  targetDirectoryStructure,
  hasAnalysisCache,
  processingPercent,
  loggingLevel,
  isCopySettingsAreaVisible
} = inject(PrakStateSymbol);

const stats = ref({
  targetStats:[],
  sourceStats:[]
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
    
      Object.keys(stats.value).forEach(key=>{
        if(message[key]!==undefined){
          stats.value[key]=message[key]
        }
      })
     
    });

    if(canRunAnalysis){
      executeAnalysis(true)
    }
})
onUnmounted(()=>{
  unbindOnEvent();
})

function cleanAnalysisCache(){
  window.electronAPI.customAction({
    name:'cleanAnalysisCache',
  })
}



function normalizeExtensions(extensions) {
  if (extensions.value.some((v) => v.value === "all")) {
    return [];
  }

  return extensions.value
    .map((v) => v.value)
    .filter((v) => !!v)
    .map((v) => `.` + v.split(".").join("").trim());
}


async function executeAnalysis(isDryRun = false) {
  stats.sourceStats = []
  stats.targetStats = []
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
  await executeAnalysis(false)
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
        AnalysisExtensionsStats(:stats="stats.sourceStats")

        .two-buttons
          NormalButton(style="margin-top:15px" borderColor="grey" color="black"
            :disabled="!canRunAnalysis"
            @click="canRunAnalysis && executeAnalysis(true)"
            ) 
              span(v-show="!isAnalysisComplete") ANALYZE
              span(v-show="isAnalysisComplete") RE-ANALYZE
              NSpin(
                v-show="isAnalysisInProgress"
                size="large")
          div(v-show="hasAnalysisCache")
            n-tooltip( trigger="hover"      )
              template(#trigger)
                NormalButton( borderColor="grey" color="black" style="margin-top:15px"
                @click="cleanAnalysisCache()"
                )
                  Icon(size="30" color="black")
                    CleaningServicesOutlined
              p Clear analysis cache
        
        .two-buttons
          n-tooltip(trigger="hover")
            template(#trigger)
              NormalButton(style="margin-top:15px" borderColor="grey" color="black" @click="canRunMainAction&&executeMainAction('copy')"
              :disabled="!canRunMainAction"
              ) COPY
            p Sync/Copy to target (Deduping and skipping existing files)
          
          n-tooltip( trigger="hover"      )
            template(#trigger)
              NormalButton( borderColor="grey" color="black" style="margin-top:15px"
              @click="()=>isCopySettingsAreaVisible=true"
              )
                Icon(size="30" color="black")
                  SettingsTwotone
            p Copy settings area


        n-tooltip( trigger="hover"      )
          template(#trigger)
            NormalButton(style="margin-top:15px" borderColor="grey" color="black" @click="canRunMainAction&&executeMainAction('clean')" :disabled="!canRunMainAction") CLEAN
          p Free space removing source files present in Target directory.
        

        //div
          label Source
          AnalysisStat(title="Files found" :value="stats.sourceFileCount")
          AnalysisStat(title="Size" :value="formatBytes(stats.sourceFilesSizeTotal)")
          label Target
          AnalysisStat(title="Files found" :value="43")
          AnalysisStat(title="Size" :value="1.5")
      .right-layout
        label Target  
        AnalysisExtensionsStats(:stats="stats.targetStats")
        n-tooltip( trigger="hover"      )
          template(#trigger)
            NormalButton(style="margin-top:15px" borderColor="grey" color="black" @click="()=>{}" :disabled="true") DEDUPE
          p Free space deduping in target directory
        
    LoadingBar(v-show="processingPercent!==0&&processingPercent!==100" :percent="processingPercent")       
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
.two-buttons{
  display:flex;
  column-gap: 5px;
}
</style>
