<template>
	<BRow>
		<!-- User Not Verifed -->
		<BCol v-if="!this.$store.state.user.verified" cols="12">
			<BCard bg-variant="danger" class="mb-3">
				<h5 class="text-center text-light">Account Not Verified!</h5>
				
				<BButton
					variant="outline-light"
					class="w-100"
					@click="resendVCodeEmail()"
				>Click to Resend Email</BButton>
			</BCard>
		</BCol>

		<!-- Email Sent -->
		<BCol v-if="vCodeSent" cols="12" class="mb-3">
			<BCard bg-variant="success" class="m-auto">
				<h5 class="m-0 text-center text-light">Email Sent!</h5>
			</BCard>
		</BCol>

		<!-- Error -->
		<BCol v-if="error" cols="12" class="mb-3">
			<BCard bg-variant="danger" class="m-auto">
				<h5 class="m-0 text-center text-light">{{ error }}</h5>
			</BCard>
		</BCol>
	</BRow>
</template>

<script>
	import axios from 'axios';

	export default {
		data() {
			return {
				// [AUTH-AXIOS]
				authAxios: axios.create({
					baseURL: '/api/user',
					headers: {
						user_authorization: `Bearer ${localStorage.usertoken}`
					}
				}),

				vCodeSent: false,
				error: ''
			}
		},

		methods: {
			async resendVCodeEmail() {
				console.log('r');
				const resData = (
					await this.authAxios.post('/resend-verification-email')
				).data

				if (resData.status) { this.vCodeSent = true }
				else { this.error = resData.message }
			},
		},
	}
</script>