<template lang="pug">
.root
    .section.titles
        div Extensions
        div.value Images
        div.value Repeats
        div.value Duplicated space
    .section.values(v-for="stat in stats")
        div {{stat.ext.toUpperCase()}}
        div.value {{stat.count}}
        div.value {{stat.repeatCount}}
        div.value {{formatBytes(stat.duplicatedSizeBytes)}}
    .section.totals
        div Total
        div.value {{imagesCountTotal}}
        div.value {{repeatCountTotal}}
        div.value {{formatBytes(duplicatedSizeBytesTotal)}}
</template>
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    
});

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const stats = ref([{
    ext: 'JPG',
    count: 35,
    repeatCount: 20,
    duplicatedSizeBytes: 13000
},{
    ext: 'GIF',
    count: 40,
    repeatCount: 5,
    duplicatedSizeBytes: 67000
}])

let imagesCountTotal = computed({
  get: () =>
    stats.value.reduce((a,v)=>a+v.count,0)
});
let repeatCountTotal = computed({
  get: () =>
  stats.value.reduce((a,v)=>a+v.repeatCount,0)
});
let duplicatedSizeBytesTotal = computed({
  get: () =>
  stats.value.reduce((a,v)=>a+v.duplicatedSizeBytes,0)
});

</script>
<style scoped>
.root {
    font-family: "Lato", sans-serif;
    font-size: 25px;
    font-weight: 300;
    display: flex;
    flex-direction: column;
    column-gap: 10px;
}
.titles{
    font-weight: 300;
}
.section{
    display:flex;
    justify-content: space-between;
    column-gap: 10px;
    line-height: 25px;
    border: 2px solid grey;
    padding:10px 15px;
}
.values{
    margin-top:10px;
}

.section .value{
    text-align: right;
}
.section.totals{
    margin-top:20px;
}
.section div{
    flex-basis: 25%;
}

</style>
    