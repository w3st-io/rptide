<template>
	<BAlert :variant="variant" show>
		<div class="d-flex justify-content-center">
			<div v-if="!message" class="spinner-grow"></div>
		</div>
		<span v-if="message">{{ message }}</span>
	</BAlert>
</template>

<script>
	export default {
		props: {
			variant: {
				type: String,
				required: false,
				default: 'primary'
			},

			message: {
				type: String,
				required: false,
			},
		},
	}
</script>