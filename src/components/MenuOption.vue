<script setup>
import icon1 from "@/assets/line-vector-1.svg";
import icon2 from "@/assets/line-vector-2.svg";
import icon3 from "@/assets/line-vector-3.svg";
import icon4 from "@/assets/line-vector-4.svg";
import {computed} from 'vue'
const icons = {
    icon1,
    icon2,
    icon3,
    icon4
}
const props = defineProps({
    topText:{
        type:String,
        default:'Top'
    },
    bottomText:{
        type:String,
        default:'Bottom'
    },
    number:{
        type:Number,
        default:1
    },
    icon:{
        type:String,
        default:'icon1'
    }
})
const icon = computed(()=>{
    return icons[props.icon||'icon1']
})
</script>

<template lang="pug">
.menu-option
    img(:src="icon")
    .number {{ number }}
    .text
        .top-text {{ topText }}
        .text-separator
        .bottom-text {{ bottomText }}
</template>
<style lang="scss" scoped>
.menu-option{
    display:flex;
    column-gap:15px;
    justify-content:center;
    align-items: center;
    font-size:30px;
    color:white;
}
img{
    transform: rotate(-91deg);
    padding: 0px 17px;
    max-height: 80px;
    min-width: 60px;
}
.text{
    
}
.number{
    font-size:70px;
}
.text-separator{
    border-bottom:2px solid white;
}
</style>