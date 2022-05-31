<template>
	<div class="p-5">
		<CreateAndDropDown class="mb-3" />

		<WebAppsRead />
	</div>
</template>

<script>
	import CreateAndDropDown from '../../../components/webApps/CreateAndDropDown'
	import WebAppsRead from '../../webApps/Read.vue'

	export default {
		components: {
			CreateAndDropDown,
			WebAppsRead,
		},
	}
</script>