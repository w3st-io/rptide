<template>
	<div>
		<h3 class="mb-5 text-center text-primary">Web Apps</h3>
		
		<BCard bg-variant="dark" no-body>
			<BCardHeader>
				<h4 class="m-0 text-primary">Create Web App</h4>
			</BCardHeader>

			<BCardBody>
				<Create />
			</BCardBody>
		</BCard>

		<BCard bg-variant="dark" no-body>
			<BCardHeader>
				<h4 class="m-0 text-primary">Your Web Apps</h4>
			</BCardHeader>

			<BCardBody>
				<Read />
			</BCardBody>
		</BCard>
	</div>
</template>

<script>
	import Create from './webApps/Create.vue';
	import Read from './webApps/Read.vue';

	export default {
		components: {
			Create,
			Read,
		},
	}
</script>

<style lang="scss" scoped>
	// [IMPORT] Personal //
	@import 'src/assets/styles/style.scss';

	.card {
		@extend .mb-5;
		@extend .mx-auto;
		@extend .shadow;

		max-width: 800px
	}
</style>