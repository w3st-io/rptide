// [IMPORT] //
import aos from 'aos'
import { BootstrapVue } from 'bootstrap-vue'
import Viewer from 'v-viewer'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Vue from 'vue'
import Editor from 'vue-editor-js/src/index'
import VueHeadful from 'vue-headful'
import VueYouTubeEmbed from 'vue-youtube-embed'
import 'aos/dist/aos.css'
import 'viewerjs/dist/viewer.css'
import 'tiny-slider/src/tiny-slider.scss'


// [IMPORT] Personal //
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/assets/styles/style.scss'
import '@/vee-validation-rules'


// [USE] //
Vue.use(BootstrapVue)
Vue.use(Editor)
Vue.use(Viewer)
Vue.use(VueYouTubeEmbed)


// [GLOBAL-COMPONENTS] //
Vue.component('VueHeadful', VueHeadful)
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)


// [EXPORT] Event Bus //
export const EventBus = new Vue()


// [CONFIG + RENDER] //
Vue.config.productionTip = false
new Vue({
	router,
	store,
	created() { aos.init() },
	render: h => h(App),
}).$mount('#app')