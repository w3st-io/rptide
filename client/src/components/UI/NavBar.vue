<template>
	<div id="nav-bar" class="py-3 border-bottom border-primary bg-dark">
		<BContainer>
			<nav class="px-0 navbar navbar-expand-lg navbar-dark">
				<!-- Logo -->
				<RouterLink to="/" class="navbar-brand">
					<mark
						class="h4 px-5 py-1 font-weight-bold bg-primary text-dark rounded"
					>{{ defaultData.name }}</mark>
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
					<div class="d-none d-md-block">
						<RouterLink
							v-for="(button, i) in buttons"
							:key="i"
							:to="button.path"
						>
							<BButton variant="outline-primary" size="sm" class="mr-2">
								<span v-if="button.text">{{ button.text }}</span>
								<span v-else v-html="button.navIcon"></span>
							</BButton>
						</RouterLink>
					</div>
				</div>

				<div>
					<BButton
						v-if="$store.state.user.logged"
						variant="outline-primary"
						size="sm"
						class="ml-2"
						@click="routerRedirect({ name: 'user' })"
					>{{ $store.state.user.decoded.username }}</BButton>

					<!-- NOT Logged In -->
					<BButton
						v-if="!$store.state.user.logged"
						variant="outline-secondary"
						size="sm"
						@click="routerRedirect({ name: 'user_login' })"
					>Login</BButton>
					
					<BButton
						v-if="!$store.state.user.logged"
						variant="outline-primary"
						size="sm"
						class="ml-2"
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
	import defaultData from '@/defaults/companyInfo'
	import buttons from '@/defaults/pageLinks'
	import router from '@/router'

	export default {
		components: {
			MenuIcon,
			SideMenu,
		},

		data() {
			return {
				defaultData: defaultData,
				buttons: buttons,
			}
		},

		methods: {
			routerRedirect({ name }) { router.push({ name: name }) },

			toggle() { this.$store.state.show.SideMenu = !this.$store.state.show.SideMenu },
		},
	}
</script>