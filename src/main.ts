import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import "./main.css";
import VueSimpleSVG from "vue3-simple-svg";
import { createRouter, createWebHashHistory } from "vue-router";
import LoginFormVue from "./components/LoginForm.vue";
import StepOneView from "./components/StepOneView.vue";
import StepTwoView from "./components/StepTwoView.vue";
import AnalysisView from "./components/AnalysisView.vue";
// General Font
//import "vfonts/Lato.css";
// Monospace Font
//import "vfonts/FiraCode.css";

const pinia = createPinia();

window.electronAPI.isPackaged().then((isPackaged) => {
  if (!isPackaged) {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://localhost:8098";
    head.appendChild(script);
    console.info("Adding devtools script tag");
  }



  // 2. Define some routes
  // Each route should map to a component.
  // We'll talk about nested routes later.
  const routes = [
    {name:'Home', path: "/", component: LoginFormVue },
    {name:"StepOne", path: "/step-one", component: StepOneView },
    {name:"StepTwo", path: "/step-one", component: StepTwoView },
    {name:"Analysis", path: "/step-one", component: AnalysisView },
  ];

  // 3. Create the router instance and pass the `routes` option
  // You can pass in additional options here, but let's
  // keep it simple for now.
  const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
  });

  const app = createApp(App);

  app.use(router);

  app.use(VueSimpleSVG);

  app.use(pinia);
  app.mount("#app").$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
  });
});
