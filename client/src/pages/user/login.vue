<template>
	<BContainer class="my-5">
		<BCard
			bg-variant="dark"
			border-variant="secondary"
			class="mx-auto shadow"
			style="max-width: 800px;"
		>
			<BRow>
				<!-- Welcome Half -->
				<BCol cols="12" md="6" class="d-none d-md-block">
					<h3 class="m-3 text-center text-primary">Welcome Back</h3>
					<div class="text-center">
						<LogInIcon size="8x" class="text-primary" />
					</div>
				</BCol>

				<BCol cols="12" md="6">
					<!-- LOG IN FORM -->
					<ValidationObserver v-slot="{ handleSubmit }" tag="section">
						<form @submit.prevent="handleSubmit(login)">
							<!-- Email  -->
							<ValidationProvider
								tag="div"
								class="form-group"
								rules="required"
								v-slot="{ errors }"
							>
								<label for="email" class="text-primary">Email</label>
								<input
									v-model="email"
									name="email"
									type="email"
									class="form-control bg-dark border-primary text-light"
									:class="{ 'is-invalid border-danger': errors != '' }"
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
								<label for="password" class="text-primary">Password</label>
								<input
									v-model="password"
									name="password"
									type="password"
									class="form-control bg-dark border-primary  text-light"
									:class="{ 'is-invalid border-danger': errors != '' }"
									placeholder="******"
								>
								<span class="text-danger">{{ errors[0] }}</span>
							</ValidationProvider>
							<br>

							<!-- Submit -->
							<BButton
								variant="primary"
								size="lg"
								:disabled="submitted"
								class="w-100 mb-1"
								type="submit"
							>Login</BButton>
						</form>
						<RouterLink to="/password/request" class="text-primary">
							<u>Forgot password?</u>
						</RouterLink>
					</ValidationObserver>
				</BCol>
			</BRow>
			
			<!-- [ERROR] -->
			<BRow class="mt-3">
				<BCol cols="12">
					<Alert
						v-if="error"
						variant="danger"
						:message="error"
						class="m-auto"
						style="max-width: 800px;"
					/>
				</BCol>
			</BRow>
		</BCard>
	</BContainer>
</template>

<script>
	// [IMPORT]
	import axios from "axios";
	import { ValidationObserver, ValidationProvider } from "vee-validate";
	import { LogInIcon } from "vue-feather-icons";

	// [IMPORT] Personal
	import Alert from "@/components/inform/Alert";
	import router from "@/router";

	// [EXPORT]
	export default {
		components: {
			LogInIcon,
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
				email: "",
				password: "",
				error: "",
			}
		},

		methods: {
			async login() {
				try {
					// [VALIDATE]
					if (!this.email || !this.password)  {
						this.error = "Fields are required";
						return;
					}

					const resData = await this.authAxios.post("/login", {
						email: this.email,
						password: this.password
					});

					console.log(resData);
			
					if (resData.data.validation) {
						// [LOCAL-STORAGE] usertoken
						localStorage.setItem("usertoken", resData.data.token);

						// [STORE]
						this.$store.replaceState({
							...this.$store.state,
							key: this.$store.state.key + 1,
							user: resData.data.user,
							webApps: resData.data.webApps
						});
					}
					
					// Check Validation Status
					if (resData.data.validation == true) {
						router.go(-1);
					}
					else {
						this.error = resData.data.message;
					}
				}
				catch (err) {
					this.error = err;
				}
			},
		},

		created: async function () {
			// [REDIRECT] Logged
			if (localStorage.usertoken) {
				router.push({ name: "/" });
			}
		}
	}
</script>