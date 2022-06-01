<template>
	<div :key="$store.state.app.key" id="app">
		<!-- Top Navbar & Side Menu -->
		<NavBar v-if="$store.state.show.NavBar" />

		<!-- Admin Bottom Bar -->
		<AdminNavBar v-if="false" />

		<!-- Floating Pop Up Banner -->
		<PopUpBanner
			v-if="message"
			:message="message"
			BGColor="info"
		/>

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
	import PopUpBanner from './components/inform/PopUpBanner'
	import AdminNavBar from './components/UI/AdminNavBar'
	import Footer from './components/UI/Footer'
	import NavBar from './components/UI/NavBar'
	import Service from './services/Service'
	import UserService from './services/user/UserService'
	import Socket from './socket'

	export default {
		name: 'App',

		components: {
			PopUpBanner,
			AdminNavBar,
			Footer,
			NavBar
		},

		data() {
			return {
				reqData: {},
				message: '',
			}
		},

		methods: {
			async initializeApp() {
				this.$store.state.loading = true 

				this.reqData = await Service.index()

				if (this.reqData.status) {
					// [local-storage] //
					localStorage.setItem('node_env', this.reqData.node_env)
				}

				await UserService.s_checkIn()
			
				Socket.initialize()

				this.$store.state.loading = false 
			},
		},

		async created() {
			await this.initializeApp()
		},
	}
</script>