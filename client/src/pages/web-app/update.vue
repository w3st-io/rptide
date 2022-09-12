<template>
	<BContainer class="py-5">
		<Update
			:webApp_id="this.$store.state.user.workspace.webApp"
			class="mx-auto"
			style="max-width: 800px;"
		/>
	</BContainer>
</template>

<script>
	import Update from '../../components/webApps/Update'

	export default {
		components: {
			Update
		},
	}
</script>