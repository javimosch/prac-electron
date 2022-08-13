<script setup lang="ts">
import SourceFolderList from "./components/SourceFolderList.vue";

import {
  NButton,
  NConfigProvider,
  NInput,
  NDatePicker,
  NSpace,
  NDivider,
  NGrid,
  NGridItem,
} from "naive-ui";
import { lightTheme } from "naive-ui";
// locale & dateLocale
import { enUS, dateEnUS, frFR, dateFrFR } from "naive-ui";
</script>

<template>
  <n-config-provider :theme="lightTheme" :locale="enUS" :date-locale="dateEnUS">
    <n-space vertical>
      <n-divider>PRAK Electron</n-divider>
      <n-grid cols="3">
        <n-grid-item>
          <n-divider>Sources</n-divider>
          <SourceFolderList
        /></n-grid-item>
        <n-grid-item>
          <n-divider>Information</n-divider>
        </n-grid-item>
        <n-grid-item>
          <n-divider>Destination</n-divider>
        </n-grid-item>
      </n-grid>
    </n-space>
  </n-config-provider>
</template>

<style></style>
