<template>
	<div class="p-5">
		<h4 class="mb-4 text-primary">Selected Web App</h4>
		<Current @updatePage="$emit('updatePage')" class="mb-4" />
		<hr class="border-secondary">
		<h4 class="mb-3 text-primary">Create Web App</h4>
		<Create class="mb-4" />

		<h4 class="mb-3 text-primary">Your Web Apps</h4>
		<Read class="mb-4" />
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