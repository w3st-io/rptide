// [IMPORT] //
import io from 'socket.io-client'
import Vue from 'vue'
import Vuex from 'vuex'


// [USE] //
Vue.use(Vuex)


export default new Vuex.Store({
	state: {
		node_env: "development",
		
		app: {
			key: 0,
		},

		dashboard: {
			webApps: [],
			webApp: 'unset'
		},
		
		loading: false,

		show: {
			NavBar: true,
			Footer: true,
			SideMenu: false,
		},

		user: null,

		admin: {
			logged: false,
			decoded: {},
		},
		
		socket: localStorage.node_env == 'development' ? io('localhost:5000') : io()
	},

	// Syncrous //
	mutations: {
		isLoading(state) { state.loading = true },

		isNotLoading(state) { state.loading = false },
	},

	// Asyncronous //
	actions: {},

	getters: {},
	
	modules: {},
});
