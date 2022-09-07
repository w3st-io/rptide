<template>
	<div :key="$store.state.app.key" id="app">
		<!-- Top Navbar & Side Menu -->
		<NavBar v-if="$store.state.show.NavBar" />

		<!-- Admin Bottom Bar -->
		<AdminNavBar v-if="false" />

		<!-- Router -->
		<RouterView
			v-if="!this.$store.state.loading"
			:key="$route.name + ($route.params.id || '')"
		/>

		<!-- Bottom Footer -->
		<Footer v-if="$store.state.show.Footer" />
	</div>
</template>

<script>
	// [IMPORT]
	import axios from 'axios';

	// [IMPORT] Personal
	import AdminNavBar from './components/UI/AdminNavBar';
	import Footer      from './components/UI/Footer';
	import NavBar      from './components/UI/NavBar';
	import UserService from './services/user/UserService';

	export default {
		name: 'App',

		components: {
			AdminNavBar,
			Footer,
			NavBar
		},

		data() {
			return {
				authAxios: axios.create({
					baseURL: '/api',
					headers: {
						user_authorization: `Bearer ${localStorage.usertoken}`,
					}
				}),

				reqData: {},
			};
		},

		methods: {
			async initializeApp() {
				this.$store.state.loading = true;

				this.resData = (await this.authAxios.get('/')).data;

				if (this.reqData.status) {
					// [LOCAL-STORAGE] //
					localStorage.setItem('node_env', this.reqData.node_env);
				}

				await UserService.s_checkIn();

				this.$store.state.loading = false;
			},
		},

		async created() {
			await this.initializeApp();
		},
	}
</script>