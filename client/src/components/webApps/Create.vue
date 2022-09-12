<template>
	<div>
		<div class="input-group">
			<input
				v-model="webApp.name"
				type="text"
				class="form-control form-control-dark border-success"
				placeholder="Web App Title"
			>
			
			<div class="input-group-append">
				<BButton
					variant="success"
					class="w-100"
					@click="createWebApp()"
				>+ Create Web App</BButton>
			</div>
		</div>

		<h6 v-if="error" class="m-0 mt-3 text-danger">{{ error }}</h6>
	</div>
</template>


<script>
	import axios from 'axios'

	export default {
		data() {
			return {
				authAxios: axios.create({
					baseURL: '/api/web-app',
					headers: {
						user_authorization: `Bearer ${localStorage.usertoken}`,
					}
				}),

				error: '',

				webApp: {
					name: '',
				},
			}
		},

		methods: {
			async createWebApp() {
				try {
					this.error = ''
					
					const resData = await this.authAxios.post('/create', {
						webApp: this.webApp
					})

					console.log(resData);

					if (resData.data.status) {
						this.$store.state.webApps = resData.data.webApps
					}
					else {
						this.error = resData.data.message
					}
				}
				catch (err) {
					this.error = err
				}
			},
		},
	}
</script>