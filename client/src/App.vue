<template>
	<div id="app" :key="appKey">
		<!-- Top Navbar & Side Menu -->
		<NavBar v-if="$store.state.show.NavBar" />

		<!-- Admin Bottom Bar -->
		<AdminNavBar v-if="false" />

		<!-- Floating Pop Up Banner -->
		<PopUpBanner
			v-if="message"
			:user_decoded="user_decoded"
			:message="message"
			BGColor="info"
		/>

		<!-- Router -->
		<RouterView :key="$route.name + ($route.params.id || '')" />

		<!-- Bottom Footer -->
		<Footer v-if="$store.state.show.Footer" />
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import PopUpBanner from '@/components/inform/PopUpBanner'
	import AdminNavBar from '@/components/UI/AdminNavBar'
	import Footer from '@/components/UI/Footer'
	import NavBar from '@/components/UI/NavBar'
	import { EventBus } from '@/main'
	import Service from '@/services/Service'
	import UserService from '@/services/user/UserService'
	import Socket from '@/socket'

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
				appKey: 0,
				reqData: {},
				message: '',
			}
		},

		methods: {
			async initializeApp() {
				this.reqData = await Service.index()

				if (this.reqData.status) {
					// [local-storage] //
					localStorage.setItem('node_env', this.reqData.node_env)

					// [store] //
					this.$store.state.node_env = this.reqData.node_env
					this.$store.state.dashboard.webApps = this.reqData.webApps

					if (this.reqData.user) {
						this.$store.state.user.api.privateKey = this.reqData.user.api.privateKey
					}
				}
			},


			log() {
				console.log('%%% [APP] %%%')
				console.log('usertoken:', localStorage.usertoken)
				console.log('admintoken:', localStorage.admintoken)
			}
		},

		async created() {
			this.appKey++

			// [INIT] //
			await this.initializeApp()

			// [USER] checkIn //
			await UserService.s_checkIn()

			// [SOCKET] //
			Socket.initialize()
			
			EventBus.$on('force-rerender', () => { this.appKey++ })

			// [LOG] //
			//this.log()
		},
	}
</script>

<style lang="scss" scoped>
	#app {
		font-family:
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif
		;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>