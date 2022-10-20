<template lang="pug">
n-drawer(v-model:show="isSettingsAreaVisible" placement="right")
    n-drawer-content(
        :native-scrollbar="false"
        )
        NormalButton(style="margin-top:15px" borderColor="grey" color="black" @click="openLogsFolder") Open Logs folder

        div(style="margin-top:10px;")
            label Logging Level
            LoggingLevels(v-model="loggingLevel") 


</template>
<script setup>
import { inject} from "vue";
import { NDrawer, NDrawerContent } from "naive-ui";
import { PrakStateSymbol } from "../constants.js";

const {
  isSettingsAreaVisible,
  loggingLevel
} = inject(PrakStateSymbol);


function openLogsFolder(e) {
    e.stopPropagation();
  window.electronAPI.openLogsFolder();
}
</script>