<template>
	<BContainer class="my-5">
		<BRow>
			<BCol cols="12" class="text-light">
				<!-- Title -->
				<h3 class="mb-3 text-center">Admin Login</h3>
			</BCol>
			
			<BCol cols="12">
				<BCard
					bg-variant="dark"
					border-variant="warning"
					text-variant="light"
					class="mx-auto"
					style="max-width: 350px;"
				>
					<!-- lOG IN FORM -->
					<ValidationObserver v-slot="{ handleSubmit }">
						<form @submit.prevent="handleSubmit(login)">
							<!-- Email -->
							<ValidationProvider
								tag="div"
								class="form-group"
								rules="required|email"
								v-slot="{ errors }"
							>
								<label for="email">Email</label>
								<input
									v-model="email"
									name="email"
									type="email"
									class="form-control bg-dark text-light border-secondary"
									:class="{ 'is-invalid': errors!='' }"
									placeholder="Example@example.com"
								>
								<span class="text-danger">{{ errors[0] }}</span>
							</ValidationProvider>

							<!-- Password -->
							<ValidationProvider
								tag="div"
								class="form-group"
								rules="required"
								v-slot="{ errors }"
							>
								<label for="password">Password</label>
								<input
									v-model="password"
									name="password"
									type="password"
									class="form-control bg-dark text-light border-secondary"
									:class="{ 'is-invalid': errors!='' }"
									placeholder="******"
								>
								<span class="text-danger">{{ errors[0] }}</span>
							</ValidationProvider>
							<br>

							<!-- FORM SUBMIT -->
							<button
								class="w-100 btn btn-lg btn-primary border-danger"
								type="submit"
								:disabled="submitted"
							>Login</button>
						</form>
					</ValidationObserver>
				</BCard>
			</BCol>
		</BRow>

		<BRow>
			<BCol cols="12" class="m-0 mt-3">
				<!-- [ALERTS] -->
				<Alert v-if="error" variant="danger" :message="error" />
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import Alert from '@/components/inform/Alert'
	import router from '@/router'
	import AdminService from '@/services/admin/AdminService'

	// [EXPORT] //
	export default {
		components: {
			Alert
		},

		data() {
			return {
				submitted: false,
				email: '',
				password: '',
				reqData: '',
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] User Logged In Already //
			if (localStorage.admintoken) { router.push({ name: 'admin_profile' }) }
		},

		methods: {
			async login() {
				// Get Status from Login Function //
				try {
					this.reqData = await AdminService.s_login(
						this.email,
						this.password
					)

					if (this.reqData.validation) { router.push({ name: 'admin' }) }
					else { this.error = this.reqData.message }
				}
				catch (err) { this.error = err }
			},
		}
	}
</script>