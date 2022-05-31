<template>
	<div class="p-5">
		<h4 class="mb-3">Choose Organization</h4>

		<SelectWebApp @updatePage="$emit('updatePage')" class="mb-3" />

		<Create class="mb-3" />

		<WebAppsRead />
	</div>
</template>

<script>
	import WebAppsRead from '../../webApps/Read.vue'
	import SelectWebApp from '../../../components/dashboard/nav/SelectWebApp'
	import Create from '../../../components/webApps/Create.vue'

	export default {
		components: {
			WebAppsRead,
			SelectWebApp,
			Create,
		},
	}
</script>