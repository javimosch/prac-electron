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
.steps {
  display: flex;
  justify-content: flex-start;
}
.buttons {
  display: flex;
  justify-content: flex-start;
  column-gap: 10px;
  margin-top: 50px;
  align-self: flex-end;
}

.main {
  padding: 20px;
  background-color: var(--grey-light);
  display: flex;
  flex-direction: column;
  justify-content: start;
  row-gap: 20px;
  width: calc(100vw - 50px);
  min-height: calc(100vh - 40px);
}
.space-between {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.slide-left-enter-active {
  transition: all 0.3s linear;
}

.slide-left-leave-active {
  transition: all 0.3s linear;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>
