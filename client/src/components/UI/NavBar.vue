<template>
	<div id="nav-bar" class="py-3 border-bottom border-secondary bg-dark">
		<BContainer>
			<BRow class="pb-3">
				<BCol md="6">
					<!-- Logo -->
					<RouterLink to="/" class="navbar-brand">
						<h4
							class="m-0 font-weight-bold text-primary"
						>RpTide</h4>
					</RouterLink>
				</BCol>

				<BCol md="6" class="text-right">
					<div v-if="$store.state.user != null">
						<BButton
							variant="outline-light"
							pill
							@click="routerRedirect({ name: 'user' })"
						>Your Account</BButton>
					</div>
				</BCol>

				<BCol v-if="0 != 0" md="6">
					<!-- Hidden Menu Button -->
					<BButton
						variant="outline-primary"
						@click="toggle()"
						class="d-block d-md-none"
					><MenuIcon class="text-primary" /></BButton>
				</BCol>
			</BRow>
	
			<BRow>
				<BCol md="6" lg="4" class="text-center">
					<BRow v-if="$store.state.user">
						<BCol cols="7" class="">
							<Current class="mb-3" />

							<h6 class="smallm text-secondary">
								{{ $store.state.user.workspace.webApp }}
							</h6>
						</BCol>

						<BCol cols="5" class="">
							<div v-if="$store.state.user">
								<BButton
									variant="primary"
									pill
									class="w-100"
									@click="routerRedirect(dashboard)"
								>Dashboard</BButton>
							</div>
							
						</BCol>
					</BRow>
				</BCol>

				<BCol md="6" lg="8" class="text-right">
					<div v-if="$store.state.user != null">
						<BButton
							variant="outline-primary"
							pill
							@click="routerRedirect({ name: 'web-app' })"
						>Web Apps</BButton>
					</div>

					<!-- ! Logged In -->
					<div v-if="$store.state.user == null">
						<BButton
							variant="outline-secondary"
							pill
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
	import SideMenu from './SideMenu';
	import Current from '../webApps/Current.vue';
	import router from '../../router';

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