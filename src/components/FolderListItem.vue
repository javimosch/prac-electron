<template lang="pug">
.path(@click="emit('remove',fullPath)")
    img(:src="sourceDiskIcon")
    p
        span {{getFolderName(fullPath)}}
        .separator
        span {{fullPath}}
    .close-icon
        Icon(size="30" color="white")
          CloseOutlined 
</template>

<script setup>
import { computed, inject } from "vue";
import { Icon } from "@vicons/utils";
import { CloseOutlined } from "@vicons/material";
import sourceDiskIcon from "@/assets/source-disk.svg";

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
img{
  max-width:25px;
}

.path p {
  display: flex;
  flex-direction: column;
  row-gap: 0px;
}
.path {
  color: white;
  font-size: 18px;
  padding: 10px 15px;
  column-gap: 10px;
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

span{
text-transform: uppercase;
}
.separator{
  border-bottom:1px solid white;
  margin:5px 0px;
}

</style>