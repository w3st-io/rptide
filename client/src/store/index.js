// [IMPORT]
import io from 'socket.io-client';
import Vue from 'vue';
import Vuex from 'vuex';


// [USE]
Vue.use(Vuex);


export default new Vuex.Store({
	state: {
		key: 0,

		loading: false,

		socket: localStorage.node_env == 'development' ? io('localhost:5000') : io(),
		
		show: {
			NavBar: true,
			Footer: true,
			SideMenu: false,
		},

		limit: null,
		
		user: null,

		currentCard: {
			brand: "",
			last4: "",
			exp_month: null,
			exp_year: null,
		},
		
		webApps: [],
	},

	// Syncrous
	mutations: {
		isLoading(state) { state.loading = true; },

		isNotLoading(state) { state.loading = false; },
	},

	// Asyncronous
	actions: {},

	getters: {},
	
	modules: {},
});
