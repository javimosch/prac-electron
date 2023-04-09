import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import "./main.css";
import VueSimpleSVG from "vue3-simple-svg";
import { createRouter, createWebHashHistory } from "vue-router";
import LoginFormVue from "./components/LoginForm.vue";
import StepOne from "./components/views/StepOne.vue";
import StepTwo from "./components/views/StepTwo.vue";
import StepThree from "./components/views/StepThree.vue";
import CreateAccountView from './components/CreateAccountView.vue'
import Home from './components/views/Home.vue';
import VueSortable from "vue3-sortablejs";
import Settings from './components/views/Settings.vue'
import * as analytics from './analytics.js'

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
    {name:'Home', path: "/", component: Home,     meta: { transition: false} },
    {name:"StepOne", path: "/step-one",  component: StepOne, meta: { transition: false } },
    {name:"StepTwo", path: "/step-two", component: StepTwo , meta: { transition: false }},
    {name:"StepThree", path: "/StepThree", component: StepThree , meta: { transition: false }},
    {name:"settings", path:'/settings', component:Settings , meta: { transition: false}}
    //{name:"create-account", path: "/create-account", component: CreateAccountView },
    //{name:'login', path: "/", component: LoginFormVue },
  ];

  // 3. Create the router instance and pass the `routes` option
  // You can pass in additional options here, but let's
  // keep it simple for now.
  const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
  });

  // 5. Listen for route changes
router.afterEach((to, from) => {
  // 6. Call the trackPage function after each route change
  analytics.trackView(to.path);
});

  const app = createApp(App);

  app.use(router);
  app.use(VueSortable);
  app.use(VueSimpleSVG);

  app.use(pinia);
  app.mount("#app").$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
  });
});
