<template>
	<BContainer class="py-5">
		<Update :webApp_id="this.$route.params.webapp" />
	</BContainer>
</template>

<script>
	import Update from '@/components/webApps/Update'

	export default {
		components: {
			Update
		},
	}
</script>