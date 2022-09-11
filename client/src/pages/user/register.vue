<template>
	<article class="mx-auto my-5 text-light register-terminal">
		<BCard bg-variant="dark" border-variant="muted">
			<h4 class="mb-3 text-center">Register</h4>
			<h6 class="mb-3 text-center text-secondary">Join Something Awesome!</h6>

			<ValidationObserver v-slot="{ handleSubmit }">
				<form @submit.prevent="handleSubmit(register)">
					<!-- Email -->
					<ValidationProvider
						tag="div"
						type="email"
						class="form-group"
						rules="required"
						v-slot="{ errors }"
					>
						<label>Email</label>
						<input
							v-model="formData.email"
							name="email"
							type="email"
							class="form-control bg-dark text-light border-secondary"
							:class="{ 'is-invalid border-danger': errors != '' }"
							placeholder="example@example.com"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>

					<!-- Password -->
					<ValidationProvider
						tag="div"
						class="form-group"
						rules="required|password:8, 50|confirmed:@confirmation"
						v-slot="{ errors }"
					>
						<label>Password</label>
						<input
							v-model="formData.password"
							type="password"
							class="form-control bg-dark text-light border-secondary"
							:class="{ 'is-invalid border-danger': errors != '' }"
							placeholder="Password"
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
							placeholder="Repeat Password"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>

					<!-- Submit -->
					<button type="submit" class="w-100 mt-5 btn btn-lg btn-primary">
						Register
					</button>
				</form>
			</ValidationObserver>
		</BCard>
		
		<!-- [ERROR] -->
		<Alert v-if="error" variant="danger" :message="error" class="m-0 mt-3" />
	</article>
</template>

<script>
	// [IMPORT] Personal //
	import Alert from '@/components/inform/Alert'
	import router from '@/router'
	import Service from '@/services'

	// [EXPORT]
	export default {
		components: {
			Alert,
		},

		data() {
			return {
				formData: {
					email: '',
					password: '',
				},
				data: '',
				error: '',
				confirm: '',
			}
		},

		async created() {
			// [REDIRECT] Log Required //
			if (localStorage.usertoken) { router.push({ name: '/' }) }
		},

		methods: {
			async register() {
				try {
					this.data = await Service.s_register({
						email: this.formData.email,
						password: this.formData.password,
					})

					// Check Status //
					if (this.data.created) { router.push({ name: 'user_registered' }) }
					else { this.error = this.data.message }
				}
				catch (err) { this.error = err }
			},
		}
	}
</script>

<style scoped>
	.register-terminal { max-width: 350px; }
</style>