<template>
	<div id="nav-bar" class="py-3 border-bottom border-primary bg-dark">
		<BContainer>
			<nav class="px-0 navbar navbar-expand-lg navbar-dark">
				<!-- Logo -->
				<RouterLink to="/" class="navbar-brand">
					<mark
						class="h4 px-5 py-1 font-weight-bold bg-primary text-dark rounded"
					>RpTide</mark>
				</RouterLink>

				<!-- Hidden Menu Button -->
				<BButton
					variant="outline-primary"
					@click="toggle()"
					class="d-block d-md-none"
				><MenuIcon class="text-primary" /></BButton>
			</nav>
	
			<BNavbar class="px-0 py-2">
				<div class="mr-auto">
					<BButton
						v-if="$store.state.user"
						variant="primary"
						pill
						class="px-3"
						@click="routerRedirect(routerParams.dashboard)"
					>Dashboard</BButton>
				</div>

				<div>
					<BButton
						v-if="$store.state.user"
						variant="outline-primary"
						pill
						class="ml-2 px-3"
						@click="routerRedirect({ name: 'user' })"
					>Your Account</BButton>

					<!-- NOT Logged In -->
					<BButton
						v-if="!$store.state.user"
						variant="outline-secondary"
						pill
						class="px-3"
						@click="routerRedirect({ name: 'user_login' })"
					>Login</BButton>
					
					<BButton
						v-if="!$store.state.user"
						variant="outline-primary"
						pill
						class="ml-2 px-3"
						@click="routerRedirect({ name: 'user_register' })"
					>Register</BButton>
				</div>
			</BNavbar>
		</BContainer>

		<!-- Hidden Side Menu -->
		<SideMenu />
	</div>
</template>

<script>
	// [IMPORT] //
	import { MenuIcon } from 'vue-feather-icons'

	// [IMPORT] Personal //
	import SideMenu from '@/components/UI/SideMenu'
	import router from '@/router'

	export default {
		components: {
			MenuIcon,
			SideMenu,
		},

		data() {
			return {
				routerParams: {
					dashboard: {
						name: 'dashboard',
						params: {
							webapp: localStorage.selectedWebApp,
							tab: 'web-content',
							sort: 0,
							limit: 5,
							page: 1,
						}
					}
				}
			}
		},

		methods: {
			routerRedirect(params) { router.push(params) },

			toggle() { this.$store.state.show.SideMenu = !this.$store.state.show.SideMenu },
		},
	}
</script>