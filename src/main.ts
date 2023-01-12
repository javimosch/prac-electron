import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from 'pinia'
import "./main.css";

// General Font
import "vfonts/Lato.css";
// Monospace Font
import "vfonts/FiraCode.css";


const pinia = createPinia()

window.electronAPI.isPackaged().then((isPackaged) => {
  if (!isPackaged) {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://localhost:8098";
    head.appendChild(script);
    console.info("Adding devtools script tag");
  }

  const app = createApp(App)

  app.use(pinia)
  app
    .mount("#app")
    .$nextTick(() => {
      postMessage({ payload: "removeLoading" }, "*");
    });
});
