<template lang="pug">
Layout
    template(v-slot:stepTwo)
        ExtensionsSelect
        .buttons
            BigButton(:disabled="!isNextEnabled" 
            fullWidth
            @click="isNextEnabled &&$emit('clickNext')") Run analysis
</template>
<script setup>
import {computed, inject} from 'vue'
import { PrakStateSymbol } from "@/constants.js";
const {
    extensions
} = inject(PrakStateSymbol);
const isNextEnabled = computed({
    get: ()=> extensions.value.length > 0
})
</script>
<styles lang="scss" scoped>
 .buttons{
        display:flex;
        justify-content: flex-start;
        column-gap: 10px;
        margin-top:50px;
        align-self: flex-end;
    }
</styles>
