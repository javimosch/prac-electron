<template lang="pug">
n-drawer(v-model:show="isCopySettingsAreaVisible" placement="right")
    n-drawer-content(
        :native-scrollbar="false"
        )
        div(style="margin-top:10px;")
            TargetStructureSelect    
</template>
<script setup>
import { inject} from "vue";
import { NDrawer, NDrawerContent } from "naive-ui";
import { PrakStateSymbol } from "../constants.js";

const {
    isCopySettingsAreaVisible
} = inject(PrakStateSymbol);
</script>