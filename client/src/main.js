// [IMPORT]
import aos from "aos";
import { BootstrapVue } from "bootstrap-vue";
import Viewer from "v-viewer";
import Vue from "vue";
import Editor from "vue-editor-js/src/index";
import VueHeadful from "vue-headful";
import VueYouTubeEmbed from "vue-youtube-embed";
import "aos/dist/aos.css";
import "viewerjs/dist/viewer.css";
import "tiny-slider/src/tiny-slider.scss";


// [IMPORT] Personal
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import "@/assets/styles/index.scss";
import "@/vee-validation-rules";


// [USE]
Vue
	.use(BootstrapVue)
	.use(Editor)
	.use(Viewer)
	.use(VueYouTubeEmbed)
;


// [GLOBAL-COMPONENTS]
Vue
	.component("VueHeadful", VueHeadful)
;


// [EXPORT] Event Bus
export const EventBus = new Vue();


// [CONFIG + RENDER]
Vue.config.productionTip = false;
new Vue({
	router,
	store,
	created() { aos.init() },
	render: h => h(App),
}).$mount("#app");