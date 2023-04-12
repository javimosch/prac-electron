<template lang="pug">
SelectMultiple(title="Camera's image raw file selection" :options="options" v-model="extensions")
</template>
<script setup>
import { ref, inject, watch } from "vue";
import * as analytics from '@/analytics.js'
import { PrakStateSymbol } from "@/constants.js";
const { extensions } = inject(PrakStateSymbol);

const props = defineProps({});

const optionText = {
  all: 'All'
}
 

const options = ref(
  extData.extensions.map((ext) => ({
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

    analytics.trackAction('extensions_select',{
      type:'select',
      extensions: [...val]
    })

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
<script>
export let extData = {
  "extensions": [
    "all", "jpg", "png", "gif", "tiff",
    ".3fr",
    ".ari",
    ".arw",
    ".bay",
    ".braw",
    ".crw",
    ".cr2",
    ".cr3",
    ".cap",
    ".data",
    ".dcs",
    ".dcr",
    ".dng",
    ".drf",
    ".eip",
    ".erf",
    ".fff",
    ".gpr",
    ".iiq",
    ".k25",
    ".kdc",
    ".mdc",
    ".mef",
    ".mos",
    ".mrw",
    ".nef",
    ".nrw",
    ".obm",
    ".orf",
    ".pef",
    ".ptx",
    ".pxn",
    ".r3d",
    ".raf",
    ".raw",
    ".rwl",
    ".rw2",
    ".rwz",
    ".sr2",
    ".srf",
    ".srw",
    ".tif",
    ".x3f"
  ]
}

//Video
extData.extensions.push("mkv", "flv", "vob", "ogv", "ogg", "rrc", "gifv", "mng", "mov", "avi", "qt", "wmv", "yuv", "rm", "asf", "amv", "mp4", "m4p", "m4v", "mpg", "mp2", "mpeg", "mpe", "mpv", "svi", "3gp", "3g2", "mxf", "roq", "nsv", "f4v", "f4p", "f4a", "f4b", "mod");

</script>
<style scoped></style>
