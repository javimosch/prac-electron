<template lang="pug">
Layout
    template(v-slot:stepOne)
        .top
            SourceFoldersSelector
            //TargetFolderList(v-if="mainAction!=='dedupe'")
        .buttons
            SecondaryButton(
            fullWidth
            :disabled="!isNextEnabled"
            @click="()=>isNextEnabled&& router.push({name:'StepTwo'})") Next
        
</template>
<script setup>
import { inject, computed } from "vue";
import { useRouter } from "vue-router";
import { PrakStateSymbol } from "@/constants.js";
const { sourceFolders } = inject(PrakStateSymbol);
const router = useRouter();
const isNextEnabled = computed(() => sourceFolders.value.length > 0);
</script>
<style scoped>

.buttons {
  display: flex;
  justify-content: flex-start;
  column-gap: 10px;
  margin-top: 50px;
  align-self: flex-end;
}

</style>
