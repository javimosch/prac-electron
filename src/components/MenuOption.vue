<script setup>
import icon1 from "@/assets/line-vector-1.svg";
import icon2 from "@/assets/line-vector-2.svg";
import icon3 from "@/assets/line-vector-3.svg";
import icon4 from "@/assets/line-vector-4.svg";
import { computed } from "vue";
const icons = {
  icon1,
  icon2,
  icon3,
  icon4,
};
const props = defineProps({
  topText: {
    type: String,
    default: "Top",
  },
  bottomText: {
    type: String,
    default: "Bottom",
  },
  number: {
    type: Number,
    default: 1,
  },
  icon: {
    type: String,
    default: "icon1",
  },
  selected: {
    type: Boolean,
    default: false,
  },
  disabled:{
    type:Boolean,
    default:false
  }
});

const cursor = computed(()=>props.disabled?'initial':'pointer')

const icon = computed(() => {
  return icons[props.icon || "icon1"];
});
</script>

<template lang="pug">
.menu-option(:class="{selected:selected}")
    img(:src="icon")
    .number {{ number }}
    .text
        .top-text {{ topText }}
        .text-separator
        .bottom-text {{ bottomText }}
</template>
<style lang="scss" scoped>
.menu-option {
  display: flex;
  column-gap: 5px;
  justify-content: flex-start;
  align-items: center;

  font-size: 28px;
  opacity: 0.6;
  color: white;
  cursor:v-bind(cursor);
}
.menu-option.selected {
  font-size: 30px;
  opacity:1;
}
img {
  padding: 0px 0px;
  max-height: 80px;
  min-width: 60px;
}
.text {
}
.number {
  font-size: 60px;
  min-width: 50px;
  text-align: center;
}
.text-separator {
  border-bottom: 2px solid white;
}
</style>
