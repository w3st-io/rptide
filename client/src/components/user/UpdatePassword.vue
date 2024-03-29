<template>
	<div class="my-5">
		<BCard
			no-body
			bg-variant="dark"
			border-variant="secondary"
			text-variant="light"
			class="m-auto w-100 shadow"
		>
			<BCardHeader class="border-secondary">
				<h4 class="m-0 text-primary">Change Password</h4>
			</BCardHeader>

			<BCardBody>
				<ValidationObserver v-slot="{ handleSubmit }">
					<form @submit.prevent="handleSubmit(submit)">
						<!-- Current Password -->
						<ValidationProvider
							tag="div"
							class="form-group"
							rules="required"
							v-slot="{ errors }"
						>
							<input
								v-model="formData.currentPassword"
								type="password"
								class="form-control bg-dark text-light border-secondary"
								:class="{ 'is-invalid border-danger': errors != '' }"
								placeholder="Current Password"
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
							<input
								v-model="confirm"
								name="confirm"
								type="password"
								class="form-control bg-dark text-light border-secondary"
								:class="{ 'is-invalid border-danger': errors != '' }"
								placeholder="Repeat Password"
							>
							<span class="text-danger">{{ errors[0] }}</span>
						</ValidationProvider>
				
						<!-- Submit -->
						<BButton
							:disabled="submitted"
							variant="primary"
							class="w-100"
							type="submit"
						>Reset Password</BButton>
					</form>
				</ValidationObserver>
			</BCardBody>
		</BCard>

		<!-- Message -->
		<Alert
			v-if="message"
			variant="info"
			:message="message"
			class="mx-auto mt-3"
			style="max-width: 500px;"
		/>
	</div>
</template>

<script>
	// [IMPORT]
	import axios from "axios";
	import { ValidationObserver, ValidationProvider } from "vee-validate";

	// [IMPORT] Personal
	import Alert from '@/components/inform/Alert'
	import router from '@/router'

	// [EXPORT]
	export default {
		components: {
			Alert,
			ValidationObserver,
			ValidationProvider
		},

		data() {
			return {
				authAxios: axios.create({
					baseURL: '/api/user',
					headers: {
						user_authorization: `Bearer ${localStorage.usertoken}`,
					}
				}),

				submitted: false,
				message: '',
				formData: {
					currentPassword: '',
					password: '',
				},
				confirm: '',
			} 
		},

		methods: {
			async submit() {
				try {
					this.submitted = true

					const resData = (
						await this.authAxios.post('/update/password', {
							currentPassword: this.formData.currentPassword,
							password: this.formData.password
						})
					).data

					this.message = resData.message

					if (resData.status) {
						this.submitted = true
						setTimeout(
							() => {
								router.push({ name: 'user_profile' })
							},
						1500
						)
					}
				}
				catch (err) { this.message = err }
				
				this.submitted = false
			},
		},
	}
</script>