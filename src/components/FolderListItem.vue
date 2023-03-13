<template lang="pug">
.path(@click="emit('remove',fullPath)")
    .path-inner
      simple-svg( 
          :src="sourceDiskIcon"
          fill-class-name="fill"
          fill="var(--light-dark)"
          customClassName="svg-maxw-25"
        )
      p
          span {{getFolderName(fullPath)}}
          .separator
          span {{fullPath}}
    .close-icon
        Icon(size="30" color="var(--light-dark)")
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
<style lang="scss" scoped>
img{
  max-width:25px;
}

.path p {
  display: flex;
  flex-direction: column;
  row-gap: 0px;
}

.path-inner{
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap:10px;
}
.path {
  color: var(--light-dark);
  font-size: 12px;
  padding: 10px 30px;
  column-gap: 10px;
  display:grid;
  grid-template-columns: 90% 1fr;
  cursor: pointer;
  background-color: var(--light);
  p, span{
    color: var(--light-dark);
    word-break: break-all;
  }
}

.path:hover .close-icon {
  opacity: 1;
}
.close-icon {
  opacity: 0;
  display:flex;
  align-items: center;
}

span{
text-transform: uppercase;
}
.separator{
  border-bottom:1px solid white;
  margin:5px 0px;
}

</style>