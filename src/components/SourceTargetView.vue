<template lang="pug">
.steps
    StepZeroBar
    .main
        SourceFolderList
        TargetFolderList
        ExtensionsSelect
        BigButton(:disabled="!canContinue" @click="canContinue &&$emit('clickNext')") Next
    StepTwoBar
    StepThreeBar
</template>
<script setup>
import {computed, inject} from 'vue'
import { PrakStateSymbol } from "@/constants.js";

const {
    extensions
} = inject(PrakStateSymbol);

const canContinue = computed({
    get: ()=> extensions.value.length > 0
})

</script>
<style scoped>
    .steps{
        display:flex;
        justify-content: flex-start;
        
    }

    .main{
        padding:20px;
        background-color: var(--grey-light);
        display:flex;
        flex-direction: column;
        justify-content: start;
        row-gap:20px;
        width: calc(100vw - 200px);
    }
</style>
