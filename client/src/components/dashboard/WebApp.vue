<template>
	<div class="p-5">
		<h4 class="mb-4 text-primary">Create Web App</h4>

		<div class="input-group mb-3">
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

		<h4 class="mb-4 text-primary">Your Web App</h4>
		{{ $store.state.dashboard.webApps }}
		<BRow v-if="$store.state.dashboard.webApps.length !== 0" class="mb-5">
			<BCol
				v-for="(w, i) in $store.state.dashboard.webApps"
				:key="i"
				cols="12" sm="6" md="4" lg="3"
			>
				<BCard
					bg-variant="dark"
					text-variant="light"
					class="mb-3"
				>
					<h6>{{ w.title }}</h6>
					<h6 class="small text-secondary">{{ w._id }}</h6>
				</BCard>
			</BCol>
		</BRow>

		<div v-else class="mb-5">
			<h6 class="my-1 text-center text-secondary">No web apps</h6>
		</div>
	</div>
</template>

<script>
	import WebAppService from '../../services/user/WebAppService'
	import Service from '../../services/Service'

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