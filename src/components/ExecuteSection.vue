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
} from "naive-ui";
import { PrakStateSymbol } from "../constants.js";
import { useLoadingBar } from "naive-ui";
import moment from "moment";
const { sourceFolders, targetDirectory, outputResult, isOutputAreaVisible } =
  inject(PrakStateSymbol);

let loggingLevel = ref("verbose");

//Test

let formValue = ref({
  extensions: "jpg, png, gif, svg",
  targetDirectoryStructure: "flat",
  mainAction: "copy",
});

const loadingBar = useLoadingBar();

let isLoading = ref(false);
let unbindOnEvent;

watch(
  () => formValue.value.targetDirectoryStructure,
  (currV, oldV) => {
    if (currV == "preserve") {
      formValue.value.targetDirectoryMergeStrategy = "manual";
    }
  }
);

onMounted(() => {
  unbindOnEvent = window.electronAPI.onEvent((message) => {
    if (message.processing !== undefined) {
      isLoading.value = message.processing;
    }
    if (message.html) {
      outputResult.value =
        moment().format("HH:mm:ss") + " " + message.html + outputResult.value;

      //window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      isOutputAreaVisible.value = true;
    }
  });
});
onUnmounted(() => {
  unbindOnEvent();
});

function openLogsFolder() {
  isOutputAreaVisible.value = true;
  window.electronAPI.openLogsFolder();
}
async function executeAnalysis(isDryRun = false) {
  loadingBar.start();
  isLoading.value = true;
  outputResult.value = "";
  await window.electronAPI.analyzeSources([...sourceFolders.value], {
    isDryRun: isDryRun === true,
    loggingLevel: loggingLevel.value,
    mainAction: formValue.value.mainAction,
    targetDirectoryStructure: formValue.value.targetDirectoryStructure,
    targetDirectory: targetDirectory.value[0],
    include: formValue.value.extensions
      .split(",")
      .filter((v) => !!v)
      .map((v) => `.` + v.split(".").join("").trim()),
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
  <n-divider class="divider-title">Configuration</n-divider>
  <div class="center">
    <NForm :label-width="80" :size="'small'">
      <NFormItem label="Main action">
        <n-radio-group
          v-model:value="formValue.mainAction"
          name="left-size"
          style="margin-bottom: 12px"
        >
          <n-radio-button value="copy"> Copy </n-radio-button>
          <n-radio-button value="move"> Move </n-radio-button>
          <n-radio-button value="clean"> Clean </n-radio-button>
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
              <n-radio-button value="preserve" disabled>
                Preserve
              </n-radio-button>
            </template>
            The folder structure in the target directory will remain the same
            sub-dictories)
          </n-tooltip>

          <n-tooltip trigger="hover">
            <template #trigger>
              <n-radio-button value="flat"> Flat </n-radio-button>
            </template>
            Files will be copied/moved into target directory root (no
            sub-dictories)
          </n-tooltip>

          <n-tooltip trigger="hover">
            <template #trigger>
              <n-radio-button value="date"> Date </n-radio-button>
            </template>
            Files will be copied/moved into a hierarchy by date (MM-YYYY
            sub-dictories)
          </n-tooltip>

          <n-tooltip trigger="hover">
            <template #trigger>
              <n-radio-button value="type"> Type </n-radio-button>
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

      <n-popconfirm
        :negative-text="null"
        @positive-click="executeAnalysis(false)"
      >
        <template #trigger>
          <NButton :disabled="!canRun">Run</NButton>
        </template>
        Any existing file in the target directory will be preserved
      </n-popconfirm>

      <NButton @click="openLogsFolder">Logs</NButton>
    </NSpace>
  </div>
</template>
<style scoped></style>
