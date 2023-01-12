<template lang="pug">
.root
    .section.titles
        div.ext Ext
        div.value Count
        div.value Dupes Count
        div.value Dupes size
        div.value Size
    .section.values(v-for="stat in props.stats")
        div.ext {{stat.ext.toUpperCase()}}
        div.value {{stat.count||0}}
        div.value {{stat.dupesCount||0}}
        div.value {{formatBytes(stat.dupesSize||0)}}
        div.value {{formatBytes(stat.size||0)}}
    .section.totals
        div.ext Total
        div.value {{imagesCountTotal}}
        div.value {{dupesCountTotal}}
        div.value {{formatBytes(dupesSizeTotal)}}
        div.value {{formatBytes(sizeTotal)}}
</template>
<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  stats: {
    type: Array,
    default: () => [
      {
        ext: "JPG Fake",
        count: 35,
        dupesCount: 20,
        duplicatedSizeBytes: 13000,
      },
      {
        ext: "GIF Fake",
        count: 40,
        dupesCount: 5,
        duplicatedSizeBytes: 67000,
      },
    ],
  },
});

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

let imagesCountTotal = computed({
  get: () => props.stats.reduce((a, v) => a + v.count, 0),
});
let dupesCountTotal = computed({
  get: () => props.stats.reduce((a, v) => a + v.dupesCount||0, 0),
});
let dupesSizeTotal = computed({
  get: () => props.stats.reduce((a, v) => a + v.dupesSize||0, 0),
});
let sizeTotal = computed({
  get: () => props.stats.reduce((a, v) => a + v.size, 0),
});
</script>
<style scoped>
.root {
  
  font-size: 25px;
  font-weight: 300;
  display: flex;
  flex-direction: column;
  column-gap: 10px;
}
.titles {
  font-weight: 300;
}
.section {
  display: flex;
    justify-content: space-between;
    column-gap: 20px;
    border: 1px solid white;
    padding: 5px 15px;
    font-size: 20px;
    display: flex;
    align-items: center;
}
.values {
  margin-top: 5px;
}

.section .value {
  text-align: right;
}
.section.totals {
  margin-top: 20px;
  background-color: var(--buttons);
}
.section div {
  flex-basis: 25%;
}

.value:not(:last-child), .ext{
  border-right: 1px solid white;
  padding-right:5px;
}
</style>
