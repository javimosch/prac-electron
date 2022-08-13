import { createApp } from "vue";
import App from "./App.vue";
// import './samples/node-api'

// General Font
import "vfonts/Lato.css";
// Monospace Font
import "vfonts/FiraCode.css";

createApp(App)
  .mount("#app")
  .$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
  });
