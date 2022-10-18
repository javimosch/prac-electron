<template>
  <n-space>
    <n-radio-group
      :value="modelValue"
      @input="(e) => $emit('update:modelValue', e.target.value)"
      name="radiobuttongroup1"
    >
      <n-tooltip v-for="song in songs" :key="song.value" trigger="hover">
        <template #trigger>
          <n-radio-button :value="song.value" :label="song.label" />
        </template>
        {{ song.tooltip || "" }}
      </n-tooltip>
    </n-radio-group>
  </n-space>
</template>
<script setup>
import { NRadioGroup, NRadioButton, NTooltip, NSpace } from "naive-ui";
let songs = [
  {
    label: "Minimal",
    value: "minimal",
    tooltip: "error",
  },
  {
    label: "Normal",
    value: "normal",
    tooltip: "error, warn, info",
  }/*,
  {
    label: "Verbose",
    value: "verbose",
    tooltip: "error, warn, info, verbose",
  },*/
];

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);
</script>
