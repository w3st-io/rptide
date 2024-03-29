<template>
	<BContainer class="my-5">
		<BRow>
			<BCol cols="12">
				<BCard
					bg-variant="dark"
					border-variant="secondary"
					text-variant="white"
					class="m-auto w-100"
					style="max-width: 500px;"
				>
					<h5 class="text-center">Create New Password</h5>
					<p>Please enter your new password</p>

					<ValidationObserver v-slot="{ handleSubmit }">
						<form @submit.prevent="handleSubmit(submit)">
							<!-- Password -->
							<ValidationProvider
								tag="div"
								class="form-group"
								rules="required|password:8, 50|confirmed:@confirmation"
								v-slot="{ errors }"
							>
								<input
									v-model="password"
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
				</BCard>

				<!-- Message -->
				<Alert
					v-if="message"
					variant="info"
					:message="message"
					class="mx-auto mt-3"
					style="max-width: 500px;"
				/>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT]
	import axios from "axios";
	import { ValidationObserver, ValidationProvider } from "vee-validate";

	// [IMPORT] Personal
	import Alert from "@/components/inform/Alert";
	import router from "@/router";

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
					baseURL: "/api",
					headers: {
						user_authorization: `Bearer ${localStorage.usertoken}`,
					}
				}),
				submitted: false,
				password: "",
				confirm: "",
				message: "",
			} 
		},

		methods: {
			async submit() {
				this.submitted = true;

				try {
					const res = (
						await this.authAxios.post(
							"/reset-password",
							{
								user_id: this.$route.params.user_id,
								verificationCode: this.$route.params.verification_code,
								password: this.password
							}
						)
					).data;

					this.message = res.message;
				}
				catch (err) {
					this.message = err;

					this.submitted = false;
				}

				setTimeout(() => { router.push({ name: "user_login" }) }, 1500)
			},
		},
	}
</script>