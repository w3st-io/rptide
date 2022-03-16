<template>
	<BContainer class="my-3">
		<!-- Title -->
		<h3 class="mb-3 text-center text-light">Admin Register</h3>

		<BCard
			bg-variant="dark"
			border-variant="warning"
			text-variant="light"
			class="mx-auto"
			style="max-width: 350px;"
		>
			<ValidationObserver v-slot="{ handleSubmit }">
				<form @submit.prevent="handleSubmit(register)">
					<!-- Username -->
					<ValidationProvider
						tag="div"
						class="form-group"
						rules="required"
						v-slot="{ errors }"
					>
						<label for="username">Username</label>
						<input
							v-model="formData.username"
							name="username"
							type="text"
							class="form-control bg-dark text-white border-secondary"
							placeholder="username"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>

					<!-- Email -->
					<ValidationProvider
						tag="div"
						class="form-group"
						rules="required|email"
						v-slot="{ errors }"
					>
						<label for="email">Email Address</label>
						<input
							name="email"
							type="email"
							class="form-control bg-dark text-white border-secondary"
							placeholder="Example@example.com"
							v-model="formData.email"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>

					<!-- Password -->
					<ValidationProvider
						tag="div"
						class="form-group"
						rules="required|password:6,23|confirmed:@confirmation"
						v-slot="{ errors }"
					>
						<label for="password">Password</label>
						<input
							v-model="formData.password"
							name="password"
							type="password"
							class="form-control bg-dark text-light border-secondary"
							:class="{ 'is-invalid border-danger': errors != '' }"
							placeholder="******"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>

					<!-- Confirmed Password -->
					<ValidationProvider
						tag="div"
						name="confirmation"
						rules="required"
						class="form-group" 
						v-slot="{ errors }"
					>
						<label for="confirm">Confirm Password</label>
						<input
							v-model="confirm"
							type="password"
							class="form-control bg-dark text-light border-secondary"
							:class="{ 'is-invalid border-danger': errors != '' }"
							placeholder="******"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>
					<br>

					<!-- Submit -->
					<button
						type="submit"
						class="w-100 btn btn-lg btn-primary"
					>Register</button>
				</form>
			</ValidationObserver>
		</BCard>

		<!-- [ALERTS] -->
		<Alert v-if="error" variant="danger" :message="error" class="mt-3" />
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@/router'
	import AdminService from '@/services/admin/AdminService'
	import Alert from '@/components/inform/Alert'

	// [EXPORT] //
	export default {
		data() {
			return {
				error: '',
				reqData: '',
				formData: {
					usernmae: '',
					email: '',
					password: '',
				},
				confirm: '',
			}
		},

		components: {
			Alert
		},

		created: async function() {
			// [REDIRECT] Not Log Required //
			if (localStorage.admintoken) { router.push({ name: 'admin_profile' }) }
		},

		methods: {
			async register() {
				// [REGISTER] //
				try {
					this.reqData = await AdminService.s_register({
						username: this.formData.username,
						email: this.formData.email,
						password: this.formData.password,
					})

					// Check Status //
					if (this.reqData.created) { this.redirect() }
					else { this.error = this.reqData.message }
				}
				catch (err) { this.error = err }
			},

			redirect() { router.push({ name: 'admin_login' }) },

			log() {
				console.log('%%% [PAGE] Admin Register %%%')
			},
		}
	}
</script>