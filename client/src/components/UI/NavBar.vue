<template>
	<div id="nav-bar" class="pb-3 border-bottom border-primary bg-dark">
		<BContainer>
			<BNavbar class="m-0 px-0 navbar-expand-lg navbar-dark">
				<!-- Logo -->
				<RouterLink to="/" class="navbar-brand">
					<h4
						class="m-0 font-weight-bold text-primary"
					>RpTide</h4>
				</RouterLink>

				<!-- Hidden Menu Button -->
				<BButton
					variant="outline-primary"
					@click="toggle()"
					class="d-block d-md-none"
				><MenuIcon class="text-primary" /></BButton>
			</BNavbar>
	
			<BRow>
				<BCol cols="4" md="2">
					<BButton
						v-if="$store.state.user != null"
						variant="primary"
						class="w-100 mb-3 mb-md-0 "
						@click="routerRedirect({ name: 'web-app' })"
					>Web Apps</BButton>
				</BCol>

				<BCol cols="8" md="4">
					<Current
						v-if="$store.state.user != null"
						class="mb-3 mb-md-0 w-100"
					/>
				</BCol>

				<BCol cols="12" md="6" class="text-right">
					<div v-if="$store.state.user != null">
						<BButton
							variant="primary"
							pill
							class="ml-2"
							@click="routerRedirect(dashboard)"
						>Dashboard</BButton>

						<BButton
							variant="outline-primary"
							pill
							class="ml-2"
							@click="routerRedirect({ name: 'user' })"
						>Your Account</BButton>
					</div>

					<!-- ! Logged In -->
					<div v-if="$store.state.user == null">
						<BButton
							variant="outline-secondary"
							pill
							class="ml-2"
							@click="routerRedirect({ name: 'user_login' })"
						>Login</BButton>
						
						<BButton
							variant="outline-primary"
							pill
							class="ml-2"
							@click="routerRedirect({ name: 'user_register' })"
						>Register</BButton>
					</div>
				</BCol>
			</BRow>
		</BContainer>

		<!-- Hidden Side Menu -->
		<SideMenu />
	</div>
</template>

<script>
	// [IMPORT]
	import { MenuIcon } from 'vue-feather-icons';

	// [IMPORT] Personal
	import SideMenu from '@/components/UI/SideMenu';
	import Current from '../webApps/Current.vue';
	import router from '@/router';

	export default {
		components: {
			MenuIcon,
			SideMenu,
			Current
		},

		data() {
			return {
				dashboard: {
					name: 'dashboard',
					params: {
						webapp: this.$store.state.user.workspace.selectedWebApp,
						tab: 'web-content',
						sort: 0,
						limit: 5,
						page: 1,
					}
				},
			}
		},

		methods: {
			routerRedirect(params) {
				router.push(params);
			},

			toggle() {
				this.$store.state.show.SideMenu = !this.$store.state.show.SideMenu;
			},
		},
	}
</script>