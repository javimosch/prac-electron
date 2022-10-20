<template lang="pug">
.path(@click="emit('remove',fullPath)")
    p 
        span Folder name: {{getFolderName(fullPath)}}
        span Full path: {{fullPath}}
    .close-icon
        Icon(size="30" color="white")
        CloseOutlined 
</template>

<script setup>
import { computed, inject } from "vue";
import { Icon } from "@vicons/utils";
import { CloseOutlined } from "@vicons/material";

const emit = defineEmits(['remove'])

const props = defineProps({
    fullPath:{
        type: String,
        default: ''
    }
})

const fullPath = computed(()=>props.fullPath)
const getFolderName = computed(() => {
  return (fullPath) => fullPath.split("/")[fullPath.split("/").length - 1];
});

</script>
<style scoped>


.path p {
  display: flex;
  flex-direction: column;
  row-gap: 0px;
}
.path {
  color: white;
  font-family: Lato;
  font-size: 18px;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.path:hover .close-icon {
  opacity: 1;
}
.close-icon {
  opacity: 0;
}


</style>