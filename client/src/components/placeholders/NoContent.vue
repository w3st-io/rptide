<template>
	<div class="text-center">
		<h1 class="text-primary"><AlertCircleIcon size="3x" /></h1>
		<h1 class="font-weight-bold text-primary">{{ text }}</h1>
	</div>
</template>

<script>
	import { AlertCircleIcon } from 'vue-feather-icons'

	export default {
		props: {
			text: { type: String, default: 'there is no content yet' }
		},

		components: {
			AlertCircleIcon
		},
	}
</script>