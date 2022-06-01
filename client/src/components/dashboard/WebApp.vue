<template>
	<div class="p-5">
		<h3 class="mb-4 text-primary">Web Apps</h3>

		<BCard bg-variant="dark" border-variant="secondary" no-body class="mb-5">
			<BCardHeader class="border-secondary">
				<h4 class="m-0 text-primary">
					Selected Web App
					<span class="mb-4 text-muted" style="font-size: 14px;">
						Must be selected in order to proceed
					</span>
				</h4>
			</BCardHeader>

			<BCardBody>
				<Current Wclass="mb-3" />
				<h6 class="small text-muted">{{ $store.state.dashboard.webApp }}</h6>
			</BCardBody>
		</BCard>

		<BCard bg-variant="dark" border-variant="secondary" no-body class="mb-5">
			<BCardHeader class="border-secondary">
				<h4 class="m-0 text-primary">Create Web App</h4>
			</BCardHeader>

			<BCardBody>
				<Create />
			</BCardBody>
		</BCard>

		<BCard bg-variant="dark" border-variant="secondary" no-body class="mb-5">
			<BCardHeader class="border-secondary">
				<h4 class="m-0 text-primary">Your Web Apps</h4>
			</BCardHeader>

			<BCardBody>
				<Read />
			</BCardBody>
		</BCard>
	</div>
</template>

<script>
	import Create from '../webApps/Create.vue'
	import Current from '../webApps/Current.vue'
	import Read from '../webApps/Read.vue'

	export default {
		components: {
			Create,
			Current,
			Read,
		},
	}
</script>