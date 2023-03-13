<template>
    <Button
    @click="emit('click')"
    >
    <slot></slot>
    </Button>
</template>
<script setup>
const emit = defineEmits(['click'])
</script>