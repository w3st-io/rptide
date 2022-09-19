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
				<h5 class="text-center text-light">Email Sent!</h5>
			</BCard>
		</BCol>
	</BRow>
</template>

<script>
	import Service from '../../services'
	export default {
		data() {
			return {
				vCodeSent: false,
			}
		},

		methods: {
			async resendVCodeEmail() {
				if (this.user) {
					const resData = await Service.s_resendVerificationEmail(
						this.user.email
					)

					if (resData.status) { this.vCodeSent = true }
					else { this.error = resData.message }
				}
			},
		},
	}
</script>