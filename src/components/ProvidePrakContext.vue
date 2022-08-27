<script>
// src/components/ProvidePrakContext.js
import { provide, reactive, readonly, toRefs, ref } from "vue";
import { PrakStateSymbol } from "../constants.js";
export default {
  setup() {
    const state = reactive({
      sourceFolders: ref(["/home/javi/Downloads"]),
      targetDirectory: ref(["/home/javi/Documents/download-new"]),
      outputResult: ref(""),
    });
    // Using `toRefs()` makes it possible to use
    // spreading in the consuming component.
    // Making the return value `readonly()` prevents
    // users from mutating global state.
    provide(PrakStateSymbol, toRefs(state));
  },
  render() {
    // Our provider component is a renderless component
    // it does not render any markup of its own.
    return this.$slots.default();
  },
};
</script>
