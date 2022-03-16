<template>
	<nav
		class="w-50 mx-auto fixed-bottom alert shadow"
		:class="`alert-${variant}`"
		style="margin-bottom: 100px;"
	>{{ message }}</nav>
</template>

<script>
	export default {
		props: {
			message: { type: String, required: true, },
			variant: { type: String, default: 'warning' },
		},

		created: function() {
		},
	}
</script>

<style lang="scss" scoped>
	.fade-in {
		opacity: 1;
		animation-name: fadeInOpacity;
		animation-iteration-count: 1;
		animation-timing-function: ease-in;
		animation-duration: 1s;
	}

	@keyframes fadeInOpacity {
		0% { opacity: 0; }
		100% { opacity: 1; }
	}
</style>