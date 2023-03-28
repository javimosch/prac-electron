<script setup>
import AppContext from "./components/AppContext.vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";
import moment from "moment";
import { computed } from "vue";

const appStore = useAppStore();
const { appVersion, versionExpirationRef } = storeToRefs(appStore);

const expirationDateFormatted = computed(() =>
  versionExpirationRef.value?.expiration
    ? moment(versionExpirationRef.value?.expiration).format("DD/MM/YYYY")
    : ""
);
const appVersionTooltip = computed(() => {
  return `This version expires on ${expirationDateFormatted.value}`;
});
</script>
<template>
  <AppContext>
    <!--
    <router-view v-slot="{ Component }">
      <transition :name="route.meta.transition">
        <component :is="Component" />
      </transition>
    </router-view>
    -->
    <router-view></router-view>

    <div class="appVersion" :title="appVersionTooltip">{{ appVersion }}</div>
    <InternetRequiredOverlay />
    <AppExpiredOverlay />
  </AppContext>
</template>
<style lang="scss" scoped>
.appVersion {
  position: fixed;
  bottom: 10px;
  right: 5px;
}


</style>
