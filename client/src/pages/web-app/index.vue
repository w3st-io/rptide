<template>
	<BContainer class="py-5">
		<h3 class="mb-5 text-center text-primary">Web Apps</h3>
		
		<BCard bg-variant="dark" border-variant="secondary" no-body>
			<BCardHeader class="border-secondary">
				<h4 class="m-0 text-primary">Create Web App</h4>
			</BCardHeader>

			<BCardBody>
				<Create />
			</BCardBody>
		</BCard>

		<BCard bg-variant="dark" border-variant="secondary" no-body>
			<BCardHeader class="border-secondary">
				<h4 class="m-0 text-primary">Your Web Apps</h4>
			</BCardHeader>

			<BCardBody>
				<Read />
			</BCardBody>
		</BCard>
	</BContainer>
</template>

<script>
	import Create from '../../components/webApps/Create.vue';
	import Read from '../../components/webApps/Read.vue';

	export default {
		components: {
			Create,
			Read,
		},
	}
</script>

<style lang="scss" scoped>
	// [IMPORT] Personal
	@import 'src/assets/styles/index.scss';

	.card {
		@extend .mb-5;
		@extend .mx-auto;
		@extend .shadow;

		max-width: 800px
	}
</style>