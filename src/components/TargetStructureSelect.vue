<template lang="pug">
label Structure on target directory
div
    n-radio-group(v-model:value='targetDirectoryStructure' name='left-size' style='margin-bottom: 12px')
        n-tooltip(trigger='hover')
            template(#trigger='')
                n-radio-button(value='flat')  Flat 
            |           Files will be copied/moved into target directory root (no
            |           sub-dictories)
        n-tooltip(trigger='hover')
            template(#trigger='')
                n-radio-button(value='date')  Date 
            | Files will be copied/moved into a hierarchy by date (MM-YYYY)
        n-tooltip(trigger='hover')
            template(#trigger='')
                n-radio-button(value='type')  Type 
            | Files will be copied/moved into a hierarchy by Media type (MIME types) (i.g jpg, docx, videos sub-dictories)
</template>
<script setup>
import {inject} from 'vue'
import {
  NForm,
  NFormItem,
  NRadioGroup,
  NRadioButton,
  NTooltip,
} from "naive-ui";
import { PrakStateSymbol } from "../constants.js";
const { targetDirectoryStructure } =
  inject(PrakStateSymbol);
</script>