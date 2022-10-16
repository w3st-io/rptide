<template>
<BCard no-body bg-variant="dark" border-variant="secondary" class="shadow">
	<BCardHeader class="border-secondary">
		<BRow>
			<BCol cols="12" md="8">
				<h4 class="text-primary">Your API Keys</h4>
			</BCol>

			<BCol cols="12" md="4" class="text-right">
				<BButton
					variant="primary"
					size="sm"
					class="w-100"
					style="max-width: 200px;"
					@click="generateApiKey()"
				>Generate API Key</BButton>
			</BCol>
		</BRow>
	</BCardHeader>

	<BCardBody>
		<BRow>
			<BCol cols="12">
				<h3 class="m-0 text-light">
					Private Key: {{ $store.state.user.api.privateKey }}
				</h3>
			</BCol>

			<BCol cols="12">
				<h6 class="text-danger">{{ error }}</h6>
			</BCol>
		</BRow>
	</BCardBody>
</BCard>
</template>

<script>
	import axios from "axios";
	
	export default {
		data() {
			return {
				authAxios: axios.create({
					baseURL: "/api",
					headers: {
						user_authorization: `Bearer ${localStorage.usertoken}`,
					}
				}),

				error: ""
			}
		},
		methods: {
			async generateApiKey() {
				const resData = (
					await this.authAxios.post("/generate-api-key")
				).data;
				
				if (resData.status) {
					this.$store.state.user.api.privateKey = resData.privateKey;
				}
				else { this.error = resData.message; }
			},
		},
	}
</script>