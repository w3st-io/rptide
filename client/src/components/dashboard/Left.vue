<template>
	<!-- [TAB-BUTTON] Content -->
	<div>
		<BButton
			variant="none"
			pill
			class="w-100 mb-3"
			:class="{
				'btn-primary': $route.params.tab == 'web-content',
				'btn-outline-primary': $route.params.tab != 'web-content',
			}"
			@click="switchTab('web-content')"
		>Web Content</BButton>
		
		<BButton
			variant="none"
			pill
			class="w-100 mb-3"
			:class="{
				'btn-primary': $route.params.tab == 'product',
				'btn-outline-primary': $route.params.tab != 'product',
			}"
			@click="switchTab('product')"
		>Products</BButton>

		<BButton
			variant="none"
			pill
			class="w-100 mb-3"
			:class="{
				'btn-primary': $route.params.tab == 'product-options',
				'btn-outline-primary': $route.params.tab != 'product-options',
			}"
			@click="switchTab('product-options')"
		>Product Options</BButton>

		<hr>

		<router-link to="/documentation">
			<BButton
				variant="outline-secondary"
				size="sm"
				pill
				class="w-100"
			>Documentation</BButton>
		</router-link>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				node_env: localStorage.node_env,
			}
		},

		methods: {
			switchTab(tab) {
				this.$emit('switchTab', tab);
			},
		},
	}
</script>