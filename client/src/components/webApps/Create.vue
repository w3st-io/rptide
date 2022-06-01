<template>
	<div class="input-group">
		<input
			v-model="formData.webApp.title"
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
</template>


<script>
	import WebAppService from '../../services/user/WebAppService'

	export default {
		data() {
			return {
				formData: {
					webApp: {
						title: '',
					}
				},

				reqData: {},
			}
		},

		methods: {
			async createWebApp() {
				const r = await WebAppService.s_create({
					title: this.formData.webApp.title
				})

				if (r.status) {
					this.$store.state.dashboard.webApps = r.webApps
				}
			},
		},
	}
</script>