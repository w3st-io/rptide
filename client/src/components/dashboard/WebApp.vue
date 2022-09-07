<template>
<div>
	<div class="py-5">
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
</div>
</template>

<script>
	import Create from '../webApps/Create.vue'
	import Read from '../webApps/Read.vue'

	export default {
		components: {
			Create,
			Read,
		},
	}
</script>