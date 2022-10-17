<template>
	<BContainer class="my-5">
		<BRow>
			<BCol cols="12">
				<BCard
					bg-variant="dark"
					border-variant="secondary"
					text-variant="light"
					class="m-auto shadow"
					style="max-width: 500px;"
				>
					<h4 class="text-center">Enter Your Email to Reset Password</h4>

					<ValidationObserver v-slot="{ handleSubmit }">
						<form @submit.prevent="handleSubmit(submit)">
							<!-- Email -->
							<ValidationProvider
								tag="div"
								type="email"
								class="my-3 form-group"
								rules="required"
								v-slot="{ errors }"
							>
								<input
									v-model="email"
									name="email"
									type="email"
									class="form-control bg-dark text-light border-secondary"
									:class="{ 'is-invalid border-danger': errors != '' }"
									placeholder="example@example.com"
								>
								<span class="text-danger">{{ errors[0] }}</span>
							</ValidationProvider>

							<!-- Submit -->
							<BButton
								:disabled="submitted"
								variant="primary"
								type="submit"
								class="my-3 w-100"
							>Send Email</BButton>
						</form>
					</ValidationObserver>
				</BCard>
			</BCol>
		</BRow>

		<BRow class="mt-3">
			<BCol cols="12">
				<!-- [ERROR] -->
				<Alert
					v-if="error"
					variant="danger"
					:message="error"
					class="mx-auto"
					style="max-width: 500px;"
				/>
			</BCol>
			<BCol cols="12">
				<!-- [SUCCESS] -->
				<Alert
					v-if="success"
					variant="success"
					:message="success"
					class="mx-auto"
					style="max-width: 500px;"
				/>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT]
	import axios from "axios";

	// [IMPORT] Personal
	import Alert from "@/components/inform/Alert"
	import router from "@/router"

	export default {
		components: {
			Alert,
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
				email: "",
				success: "",
				error: "",
			}
		},

		async created() {
			// [REDIRECT] Log Required
			if (localStorage.usertoken) { router.push({ name: "user_profile" }) }
		},

		methods: {
			async submit() {
				try {
					this.submitted = true

					const res = (
						await this.authAxios.post("/request-reset-password", {
							email: this.email
						})
					).data;

					if (!res.status || res.existance) {
						this.error = res.message

						this.submitted = false
					}
					else {
						this.success = res.message

						setTimeout(() => { router.push({ name: "user_login" }) }, 1500)
					}
				}
				catch (err) { this.error = err }
			},
		}
	}
</script>

<style scoped>
	.register-terminal { max-width: 350px; }
</style>