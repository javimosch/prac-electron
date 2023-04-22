<template>
  <div class="overlay" 
  h-screen
  w-screen
  fixed
  top-0
  left-0
  flex
  justify-center
  items-center
  @click.stop="()=>$emit('clickOverlay')"
  >
    <div
    class="modal"
    h-3xl
    mt-20
    bg="brand-primary"
    p-5
    w-5xl
    border-rd
    @click.stop="()=>{}"
    >
        <slot></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.overlay{
    background-color: rgba(255,255,255,.5);
    z-index:999;
}
.modal{
  overflow:auto;
}
</style>
