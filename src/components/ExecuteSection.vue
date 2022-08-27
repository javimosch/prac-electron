<script setup>
import LoggingLevels from "./LoggingLevels.vue";
import { ref, inject, computed, onMounted, onUnmounted } from "vue";
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
} from "naive-ui";
import { PrakStateSymbol } from "../constants.js";
const { sourceFolders, targetDirectory, outputResult } =
  inject(PrakStateSymbol);
import { useLoadingBar } from "naive-ui";

let loggingLevel = ref("verbose");

let formValue = ref({
  extensions: "jpg, png, gif, svg",
  targetDirectoryStructure: "flat",
  mainAction: "copy",
});

const loadingBar = useLoadingBar();

let isLoading = ref(false);
let unbindOnEvent;
onMounted(() => {
  unbindOnEvent = window.electronAPI.onEvent((message) => {
    if (message.processing !== undefined) {
      isLoading.value = message.processing;
    }
    if (message.html) {
      outputResult.value += message.html;

      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  });
});
onUnmounted(() => {
  unbindOnEvent();
});

function openLogsFolder() {
  window.electronAPI.openLogsFolder();
}
async function executeAnalysis(isDryRun = false) {
  loadingBar.start();
  isLoading.value = true;
  outputResult.value = "";
  await window.electronAPI.analyzeSources([...sourceFolders.value], {
    isDryRun: isDryRun === true,
    mainAction: formValue.value.mainAction,
    targetDirectoryStructure: formValue.value.targetDirectoryStructure,
    targetDirectory: targetDirectory.value[0],
    include: formValue.value.extensions
      .split(",")
      .map((v) => `.` + v.split(".").join("")),
  });
  isLoading.value = false;
  loadingBar.finish();
  //outputResult.value = actions.map((action) => action.html).join("");
}

let canRun = computed({
  get: () =>
    isLoading.value == false &&
    sourceFolders.value.length > 0 &&
    targetDirectory.value.length > 0,
});
</script>

<template>
  <n-divider>Information</n-divider>
  <div class="center">
    <NForm :label-width="80" :size="'small'">
      <NFormItem label="Main action">
        <n-radio-group
          v-model:value="formValue.mainAction"
          name="left-size"
          style="margin-bottom: 12px"
        >
          <n-radio-button value="copy"> Copy </n-radio-button>
          <n-radio-button value="move" disabled> Move </n-radio-button>
        </n-radio-group>
      </NFormItem>
      <NFormItem label="Extensions">
        <n-input v-model:value="formValue.extensions" placeholder="jpg, png" />
      </NFormItem>
      <NFormItem label="Structure on target directory">
        <n-radio-group
          v-model:value="formValue.targetDirectoryStructure"
          name="left-size"
          style="margin-bottom: 12px"
        >
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-radio-button value="flat"> Flat </n-radio-button>
            </template>
            Files will be copied/moved into target directory root (no
            sub-dictories)
          </n-tooltip>

          <n-tooltip trigger="hover">
            <template #trigger>
              <n-radio-button value="date" disabled> Date </n-radio-button>
            </template>
            Files will be copied/moved into a hierarchy by date (MM-YYYY
            sub-dictories)
          </n-tooltip>

          <n-tooltip trigger="hover">
            <template #trigger>
              <n-radio-button value="type" disabled> Type </n-radio-button>
            </template>
            Files will be copied/moved into a hierarchy by Media type (MIME
            types) (i.g jpg, docx, videos sub-dictories)
          </n-tooltip>
        </n-radio-group>
      </NFormItem>
      <NFormItem label="Logging">
        <LoggingLevels v-model="loggingLevel" />
      </NFormItem>
    </NForm>
    <NSpace>
      <NButton :disabled="!canRun" @click="executeAnalysis(true)"
        >Dry Run</NButton
      >
      <NButton :disabled="!canRun" @click="executeAnalysis(false)">Run</NButton>
      <NButton @click="openLogsFolder">Logs</NButton>
    </NSpace>
  </div>
</template>
<style scoped></style>
