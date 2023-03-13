<template lang="pug">
SelectMultiple(title="Camera's image raw file selection" :options="options" v-model="extensions")
</template>
<script setup>
import { ref, inject, watch } from "vue";

import { PrakStateSymbol } from "@/constants.js";
const { extensions } = inject(PrakStateSymbol);

const props = defineProps({});

const optionText = {
  all: 'All file types'
}

const options = ref(
  ["all", "jpg", "pdf", "png", "git", "tiff"].map((ext) => ({
    text: (optionText[ext]||ext).toUpperCase(),
    tooltip: `${ext.toUpperCase()} files`,
    value: ext.toLowerCase(),
  }))
);

watch(
  extensions,
  () => {
    if (
      extensions.value.find((v) => v === "all") &&
      extensions.value.length > 1
    ) {
      extensions.value = ["all"];
    }

    let val = extensions.value.map((ext) =>
      ext.charAt(0) === "." ? ext.substring(1) : ext
    );
    val = val.filter(
      (ext, i) => extensions.value.findIndex((e) => e == ext) == i
    );

    window.electronAPI.customAction({
      name: "setConfigValues",
      values: [
        {
          name: "extensions",
          value: JSON.parse(JSON.stringify(val)),
        },
      ],
    });
  },
  {
    deep: true,
  }
);
</script>
<style scoped></style>
