<template>
	<BRow>
		<BCol cols="12" md="8">
			<h3 class="text-primary">Your API Keys</h3>
		</BCol>

		<BCol cols="12" md="4" class="text-right">
			<BButton
				variant="primary"
				size="sm"
				class="w-100"
				style="max-width: 200px;"
				@click="generateApiKey()"
			>
				Generate API Key
			</BButton>
		</BCol>

		<BCol cols="12">
			<h3 class="mb-4 text-light">
				Private Key: {{ $store.state.user.api.privateKey }}
			</h3>
		</BCol>
	</BRow>
</template>

<script>
	import UserService from '@/services/user/UserService'

	export default {
		methods: {
			async generateApiKey() {
				this.resData = await UserService.s_generateApiKey()
				
				if (this.resData.status) {
					this.$store.state.user.api.privateKey = this.resData.privateKey
				}
				else { this.error = this.resData.message }
			},
		},
	}
</script>