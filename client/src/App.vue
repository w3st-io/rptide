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
	// [IMPORT] Personal //
	import AdminNavBar from './components/UI/AdminNavBar';
	import Footer      from './components/UI/Footer';
	import NavBar      from './components/UI/NavBar';
	import Service     from './services/Service';
	import UserService from './services/user/UserService';
	import Socket      from './socket';

	export default {
		name: 'App',

		components: {
			AdminNavBar,
			Footer,
			NavBar
		},

		data() {
			return {
				reqData: {},
			};
		},

		methods: {
			async initializeApp() {
				this.$store.state.loading = true;
			
				// [store] //
				this.$store.state.dashboard.webApp = localStorage.selectedWebApp;

				this.reqData = await Service.index();

				if (this.reqData.status) {
					// [local-storage] //
					localStorage.setItem('node_env', this.reqData.node_env);

					// [STORE] Set the node_env
					this.$store.state.node_env = this.reqData.node_env;
				}

				await UserService.s_checkIn();

				Socket.initialize();

				this.$store.state.loading = false;
			},
		},

		async created() {
			await this.initializeApp();
		},
	}
</script>