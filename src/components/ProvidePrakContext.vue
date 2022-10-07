<script>
// src/components/ProvidePrakContext.js
import { provide, reactive, readonly, toRefs, ref } from "vue";
import { PrakStateSymbol } from "../constants.js";
export default {
  setup() {
    const state = reactive({
      sourceFolders: ref([
        /*"/home/javi/Downloads"*/
      ]),
      targetDirectory: ref([
        /*"/home/javi/Documents/download-new"*/
      ]),
      outputResult: ref(""),

      isOutputAreaVisible: ref(false),

      extensions: ref([])
    });
    // Using `toRefs()` makes it possible to use
    // spreading in the consuming component.
    // Making the return value `readonly()` prevents
    // users from mutating global state.
    provide(PrakStateSymbol, toRefs(state));
    return {
      state,
    };
  },
  async created() {
    let conf = await window.electronAPI.getConfiguration();
    console.log("Retrieved configuration", {
      conf,
    });
    if (conf.sourceItems.length > 0) {
      this.state.sourceFolders = [...conf.sourceItems.map((s) => s.fullPath)];
      this.state.targetDirectory = [conf.targetItem.fullPath || ""];
    }
  },
  render() {
    // Our provider component is a renderless component
    // it does not render any markup of its own.
    return this.$slots.default();
  },
};
</script>
