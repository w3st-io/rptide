<template>
	<div>
		<!-- Footer -->
		<footer
			class="pt-4 px-3 page-footer font-small border-top border-primary bg-dark"
		>
			<BRow>
				<BCol cols="12" class="bg-dark">
					<!-- Copyright -->
					<div class="pt-3 footer-copyright text-center text-secondary">
						<a href="https://w3st.io/">w3st.io</a>
						© {{ new Date().getFullYear() }}
						<br>
						<h6><i class="text-dark">"Dare I say it..?"</i></h6>
					</div>
					<hr class="bg-secondary">
				</BCol>

				<BCol cols="12" md="4" class="text-center"></BCol>

				<BCol cols="12" md="4" class="text-center"></BCol>

				<BCol cols="12" md="4" class="text-center">
					<BButton
						v-if="$store.state.user"
						variant="outline-secondary"
						size="sm"
						class="m-auto"
						@click="logout()"
					>Log Out</BButton>
				</BCol>
			</BRow>
		</footer>
		
		<div class="w-100 bg-dark" style="height: 500px; min-height: 60vh;"></div>
	</div>
</template>

<script>
	import router from '@/router'
	import UserService from '@/services/UserService'

	export default {
		methods: {
			logout() {
				UserService.s_logout()

				router.push({ name: 'user_login' })
			},
		}
	}
</script>