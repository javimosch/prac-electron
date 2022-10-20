<script>
// src/components/ProvidePrakContext.js
import { provide, reactive, readonly, toRefs, ref } from "vue";
import { PrakStateSymbol } from "@/constants.js";
import moment from "moment";
export default {
  setup() {
    const status = ref("analysis_required");

    const reset = ref(function () {
      status.value = "analysis_required";
      state.mainAction = "copy";
      state.targetDirectoryStructure = "flat";
      state.outputResult = "";
      state.isOutputAreaVisible = false;
      state.processingMessage=""
      state.resultStats = {}
    });

    const state = reactive({
      sourceFolders: ref([
        /*"/home/javi/Downloads"*/
      ]),
      targetDirectory: ref([
        /*"/home/javi/Documents/download-new"*/
      ]),
      outputResult: ref(""),

      isOutputAreaVisible: ref(false),

      isSettingsAreaVisible: false,

      isCopySettingsAreaVisible: ref(false),

      loggingLevel: 'minimal',

      extensions: ref([]),

      status,

      processingPercent: 0,

      processingMessage: '',

      resultStats: ref({}),

      hasAnalysisCache:false,

      mainAction: ref("copy"),
      targetDirectoryStructure: ref("flat"),
      reset,
    });

    state.reset();

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
      
    }
    if(conf.targetItem){
      this.state.targetDirectory = [conf.targetItem.fullPath || ""];
    }
    if(conf.extensions&&conf.extensions.length>0){
      this.state.extensions = conf.extensions
    }
  },
  render() {
    // Our provider component is a renderless component
    // it does not render any markup of its own.
    return this.$slots.default();
  },
  mounted() {



    this.unbindOnEvent = window.electronAPI.onEvent((message) => {
      /*console.log('Event',{
        message
      })*/

      if(message.resultStats){
        Object.keys(message.resultStats).forEach(key=>{
          if(message.resultStats[key]!==undefined){
            this.state.resultStats[key]=message.resultStats[key]
          }
        })
      }

      if(message.processingPercent!==undefined){
        this.state.processingPercent=message.processingPercent
      }

      if(message.hasAnalysisCache!==undefined){
        this.state.hasAnalysisCache=message.hasAnalysisCache
      }

      if(message.processingMessage!==undefined){
        this.state.processingMessage=message.processingMessage
      }

      

      if (message.processing !== undefined) {
        this.state.isLoading = message.processing;
      }
      if (message.html) {
        this.state.outputResult =
          moment().format("HH:mm:ss") +
          " " +
          message.html +
          this.state.outputResult;

        this.state.isOutputAreaVisible = true;
      }
    });
  },
  beforeUnmount() {
    this.unbindOnEvent();
  },
};
</script>
