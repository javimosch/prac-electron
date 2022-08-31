<script setup>
import OutputConsole from "./components/OutputConsole.vue";
import ExecuteSection from "./components/ExecuteSection.vue";
import ProvidePrakContext from "./components/ProvidePrakContext.vue";
import TargetFolderList from "./components/TargetFolderList.vue";
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
  NLoadingBarProvider,
} from "naive-ui";
import { lightTheme } from "naive-ui";
// locale & dateLocale
import { enUS, dateEnUS, frFR, dateFrFR } from "naive-ui";
</script>

<template>
  <n-loading-bar-provider>
    <ProvidePrakContext>
      <n-config-provider
        :theme="lightTheme"
        :locale="enUS"
        :date-locale="dateEnUS"
      >
        <n-space vertical>
          <n-divider>PRAK Electron</n-divider>
          <n-grid :x-gap="12" cols="1">
            <n-grid-item>
              <p>
                Deduplicate files from different directories into an empty
                folder
              </p>
            </n-grid-item>
          </n-grid>
          <n-grid :x-gap="12" cols="2">
            <n-grid-item>
              <n-divider>Sources</n-divider>
              <SourceFolderList />
              <n-divider>Destination</n-divider>
              <TargetFolderList />
            </n-grid-item>
            <n-grid-item>
              <ExecuteSection />
            </n-grid-item>
          </n-grid>
          <n-grid :x-gap="12" cols="1">
            <NGridItem>
              <n-divider>Output</n-divider>
              <OutputConsole />
            </NGridItem>
          </n-grid>
        </n-space>
      </n-config-provider>
    </ProvidePrakContext>
  </n-loading-bar-provider>
</template>

<style scoped>
.center {
  display: flex;
  justify-content: center;
}
.n-space {
  padding: 20px;
}
</style>
