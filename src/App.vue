<script setup>

import ProvidePrakContext from "./components/ProvidePrakContext.vue";
import TargetFolderList from "./components/TargetFolderList.vue";

import StepZero from "./components/StartView.vue";
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
  NPopselect,
  NCard,
} from "naive-ui";
import { lightTheme } from "naive-ui";
// locale & dateLocale
import { enUS, dateEnUS, frFR, dateFrFR } from "naive-ui";
import { ref, inject} from "vue";
import {storeToRefs} from 'pinia'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const options = ref([
  {
    label: "Default",
    value: "default",
  },
]);
const configName = ref("default");

const { currentViewName } = storeToRefs(appStore)

function gotoView(viewNameParam) {
  currentViewName.value = viewNameParam;
}
</script>

<template>
  <n-loading-bar-provider>
    <ProvidePrakContext>
      <n-config-provider
        :theme="lightTheme"
        :locale="enUS"
        :date-locale="dateEnUS"
      >
        <StartView
          @click="gotoView('SourceTargetView')"
          @gotoStep="(n) => gotoView(n)"
          v-if="currentViewName === 'StartView'"
        />
        <SourceTargetView
          @clickNext="gotoView('AnalysisView')"
          @gotoStep="(n) => gotoView(n)"
          v-show="currentViewName === 'SourceTargetView'"
        />
        <AnalysisView
          v-if="currentViewName === 'AnalysisView'"
          @gotoStep="(n) => gotoView(n)"
        />

        <ProcessingView
          v-if="currentViewName === 'ProcessingView'"
          @gotoStep="(n) => gotoView(n)"
        />

        <SettingsDrawer/>
        <CopySettingsDrawer/>


        <n-space vertical v-if="false">
          <n-grid :x-gap="5" cols="1" v-if="false">
            <n-grid-item>
              <n-card title="Configuration">
                <n-popselect
                  v-model:value="configName"
                  :options="options"
                  size="medium"
                  scrollable
                >
                  <n-button style="margin-right: 8px">
                    {{ configName || "(Select)" }}
                  </n-button>
                </n-popselect>
              </n-card>
            </n-grid-item>
          </n-grid>
          <n-grid :x-gap="12" cols="1">
            <n-grid-item> </n-grid-item>
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
