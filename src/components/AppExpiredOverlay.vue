<template>
  <div class="overlay expired-overlay" v-show="isExpired">
    <div class="header">
      <Icon size="30" color="white">
        <WarningFilled />
      </Icon>
      <span>The app has expired</span>
    </div>
    <div class="message">The current app version {{ appVersion }} has expired. Please download a new version from the  
    <a href="#" @click="openOficialWebsiteExternal">official website</a>
    </div>
  </div>
</template>
<script setup>
import { watchEffect, computed, ref } from "vue";
import { WarningFilled } from "@vicons/material";
import { storeToRefs } from "pinia";
import { Icon } from "@vicons/utils";
import { getAppVersionExpiration } from "@/api/client";
import moment from "moment";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const { appVersion, appSettingsRef, versionExpirationRef:storeVersionExpirationRef } = storeToRefs(appStore);

const versionExpirationRef = ref(null);
const isExpired = computed(() => !!versionExpirationRef.value && moment(versionExpirationRef.value.expiration).isBefore(moment()));

function openOficialWebsiteExternal(){
    window.electronAPI.openExternalLink(appSettingsRef.value.official_website_url)
}

watchEffect(async () => {
  if (!!appVersion.value) {
    let items = await getAppVersionExpiration(appVersion.value);
    if (items.length > 0) {
      versionExpirationRef.value = items[0];
      storeVersionExpirationRef.value = versionExpirationRef.value
    }
    console.log('getAppVersionExpiration',{
      items,
    });
  }
});
</script>
<style lang="scss" scoped>
.overlay {
  position: fixed;
  width: calc(100vw);
  height: calc(100vh);
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0px;
  background: radial-gradient(#0b0707, #080808e0);
  font-size: 18px;
  font-family: system-ui;
  font-weight: 300;
  color: #c9c9c9;
  flex-direction: column;
}
.header {
  display: flex;
  justify-content: space-between;
  width: 220px;
  align-items: center;
  font-weight: bold;
  margin-bottom: 30px;
  column-gap: 5px;
}
.message{
    margin:20px;
}
a{
    text-decoration: none;
    color:var(--light-grey);
}
</style>
