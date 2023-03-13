<template lang="pug">
Layout
    template(v-slot:stepTwo)
        ExtensionsSelect
        .buttons
            PrimaryButton(:disabled="!isNextEnabled" 
            fullWidth
            @click="isNextEnabled &&handleNextClick()") Scan
</template>
<script setup>
import {computed, inject} from 'vue'
import { PrakStateSymbol } from "@/constants.js";
import { useRouter } from "vue-router";

const router = useRouter();
const {
    extensions
} = inject(PrakStateSymbol);
const isNextEnabled = computed({
    get: ()=> extensions.value.length > 0
})

function handleNextClick(){
    router.push({
    name:'StepThree',
  });
}

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
