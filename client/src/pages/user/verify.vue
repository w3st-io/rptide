<template>
	<BContainer class="my-5">
		<BCard bg-variant="dark" class="mx-auto" style="max-width: 500px;">
			<div v-if="success">
				<h3 class="text-success text-center">{{ success }}</h3>
				<h1 class="text-success text-center" style="font-size: 6em;">✓</h1>
			</div>

			<div v-if="error">
				<h3 class="text-danger text-center">Could not verify account</h3>
				<h1 class="text-danger text-center" style="font-size: 6em;">𝘹</h1>

				<p class="mt-3 text-light">{{ error }}</p>
			</div>
		</BCard>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal
	import Service from '@/services'

	export default {
		data() {
			return {
				user_id: this.$route.params.user_id,
				verificationCode: this.$route.params.verification_code,
				success: '',
				error: '',
			}
		},

		async created() {
			try {
				const returned = await Service.s_completeRegistration(
					this.user_id,
					this.verificationCode
				)

				if (returned.status) {
					this.success = 'Verified!'
				}
				else { this.error = returned.message }
			}
			catch (err) { this.error = err }
		},
	}
</script>