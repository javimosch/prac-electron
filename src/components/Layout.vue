<script setup>
import Menu from "@/components/Menu.vue";
import {useSlots, computed} from 'vue'
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";

import icon1 from "@/assets/line-vector-1.svg";
import icon2 from "@/assets/line-vector-2.svg";
import icon4 from "@/assets/line-vector-4.svg";

const slots = useSlots();
const hasSlot = (name) => {
  return !!slots[name];
};

const hasStepsSlot = computed(()=>{
    return hasSlot('stepOne') || hasSlot('stepTwo') || hasSlot('stepThree');
})

const appStore = useAppStore();
const { brandSubtitle } = storeToRefs(appStore);
</script>
<template lang="pug">
.layout
    .brand-wrapper
        Brand
        //h1.brand-subtitle {{ brandSubtitle }}
        .icons-wrapper
            img(:src="icon1")
            img(:src="icon2")
            img(:src="icon4") 
    .layout-content
        Menu
        .layout-content-inner(:class="{bg:hasSlot('default')}")
            .layout-step-wrapper(:class="{enabled: hasStepsSlot}")
                .slot-one(:class="{bg:hasSlot('stepOne')}")
                    slot(name="stepOne")
                .slot-two(:class="{bg:hasSlot('stepTwo')}")
                    slot(name="stepTwo")
                .slot-three(:class="{bg:hasSlot('stepThree')}")
                    slot(name="stepThree")
            div(:class="{'slot-default':hasSlot('default')}")
                slot
</template>
<style lang="scss" scoped>
.layout {
  display: grid;
    grid-template-columns: 160px 1fr;
    height: calc(100vh);
}
.layout-content,
.brand-wrapper {
  align-self: flex-start;
}
.layout-content {
  height: calc(100vh);
    display: grid;
    grid-template-rows: 168px 1fr;
}
.brand-subtitle {
  padding: 0px;
  margin: 0px;
  text-align: right;
}

.brand-wrapper {
  height: inherit;
  flex-basis: 15%;
}
.icons-wrapper {
  height: calc(100% - 179px);
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  img {
    max-width: 50px;
    max-height: 100px;
  }
}
.layout-content-inner {
    height: calc(100vh - 168px);
    &.bg{
      background-color: var(--light-grey);
    }
}
.layout-step-wrapper {
    
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  &.enabled{
    height: calc(100vh - 168px);
  }
}
.slot-one.bg,
.slot-two.bg,
.slot-three.bg{
  background-color: var(--light-grey);
  padding: 20px 15px;
}
.slot-default{
  padding: 20px 15px;
}

</style>
