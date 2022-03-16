<template>
	<div
		v-html="adsenseContent"
		class="border border-danger bg-dark"
	></div>
</template>

<script>
	export default {
		data() {
			return {
				adsenseContent: '',
			}
		},

		created() {
			this.adsenseContent = document.getElementById('div-adsense')
		}
	}
</script>