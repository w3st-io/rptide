<template>
	<div class="overlay h-100 w-100 position-fixed">
		<div class="overlay-content w-100 position-relative text-center">
			<BCard
				bg-variant="dark"
				text-variant="light"
				class="mx-auto"
				style="max-width: 600px;"
			>
				<h4 class="mb-3">Choose Organization</h4>

				<SelectWebApp @updatePage="$emit('updatePage')" class="mb-3" />

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
			</BCard>
		</div>
	</div>
</template>

<script>
	import SelectWebApp from '../../components/dashboard/SelectWebApp'
	import Service from '../../services/Service'
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

		components: {
			SelectWebApp,
		},

		methods: {
			async createWebApp() {
				const r = await WebAppService.s_create({
					title: this.formData.webApp.title
				})

				if (r.status) {
					// Update store
					this.reqData = await Service.index()

					if (this.reqData.status) {
						this.$store.state.dashboard.webApps = this.reqData.webApps
					}
				}
			},
		},
	}
</script>