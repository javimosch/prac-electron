<script setup>
import OutputArea from "./components/OutputArea.vue";

import ExecuteSection from "./components/ExecuteSection.vue";
import ProvidePrakContext from "./components/ProvidePrakContext.vue";
import TargetFolderList from "./components/TargetFolderList.vue";
import SourceFolderList from "./components/SourceFolderList.vue";
import StepZero from "./components/StepZero.vue";
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

import { ref } from "vue";

const options = ref([
  {
    label: "Default",
    value: "default",
  },
]);
const configName = ref("default");

let viewName = ref('StepOne')



function gotoView(viewNameParam){
  viewName.value = viewNameParam
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
      
        <StepZero @click="gotoView('StepOne')" v-if="viewName==='StepZero'"/>
        <StepOne @clickNext="gotoView('app')" v-if="viewName==='StepOne'"/>
      

        <n-space vertical v-if="viewName==='app'">
          <n-grid :x-gap="5" cols="1">
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
          <n-grid :x-gap="12" cols="3">
            <n-grid-item>
              <n-divider class="divider-title-red">Sources</n-divider>
              <SourceFolderList />
            </n-grid-item>
            <n-grid-item>
              <ExecuteSection />
            </n-grid-item>
            <n-grid-item>
              <n-divider class="divider-title-blue">Destination</n-divider>
              <TargetFolderList />
            </n-grid-item>
          </n-grid>
        </n-space>
        <OutputArea />
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
