<template>
	<div>
		<h4 class="mb-3">Choose Organization</h4>

		<SelectWebApp :key="key" @updatePage="$emit('updatePage')" class="mb-3" />

		<div class="input-group">
			<input
				v-model="formData.webApp.title"
				type="text"
				class="form-control form-control-dark border-success"
				placeholder="Web App Title"
			>
			
			<div class="input-group-append">
				<BButton
					variant="outline-success"
					class="w-100"
					@click="createWebApp()"
				>+ Create Web App</BButton>
			</div>	
		</div>
	</div>
</template>

<script>
	import SelectWebApp from '../../components/dashboard/nav/SelectWebApp'
	import WebAppService from '../../services/user/WebAppService'

	export default {
		data() {
			return {
				key: 0,

				formData: {
					webApp: {
						title: '',
					}
				},

				reqData: {},
			}
		},

		components: {
			SelectWebApp,
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