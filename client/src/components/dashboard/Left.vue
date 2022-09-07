<template>
<div>
	<!-- [TAB-BUTTON] Web App -->
	<BRow class="pt-3">
		<BCol cols="12">
			<BButton
				variant="none"
				pill
				size="lg"
				class="w-100"
				:class="{
					'btn-primary': $route.params.tab == 'web-app',
					'btn-outline-primary': $route.params.tab != 'web-app',
				}"
				@click="switchTab('web-app')"
			>Web Apps</BButton>
			
			<hr class="border-secondary">
		</BCol>
	</BRow>

	<!-- [TAB-BUTTON] Content -->
	<div class="pb-3">
		<BButton
			variant="none"
			size="lg"
			pill
			class="w-100 mb-3"
			:class="{
				'btn-primary': $route.params.tab == 'web-content',
				'btn-outline-primary': $route.params.tab != 'web-content',
			}"
			@click="switchTab('web-content')"
		>Web Content</BButton>
		
		<BButton
			v-if="$store.state.node_env == 'development'"
			variant="none"
			size="lg"
			pill
			class="w-100 mb-3"
			:class="{
				'btn-primary': $route.params.tab == 'product',
				'btn-outline-primary': $route.params.tab != 'product',
			}"
			@click="switchTab('product')"
		>Products</BButton>

		<BButton
			v-if="$store.state.node_env == 'development'"
			variant="none"
			size="lg"
			pill
			class="w-100"
			:class="{
				'btn-primary': $route.params.tab == 'product-options',
				'btn-outline-primary': $route.params.tab != 'product-options',
			}"
			@click="switchTab('product-options')"
		>Product Options</BButton>
	</div>
</div>
</template>

<script>
	export default {
		methods: {
			switchTab(tab) {
				this.$emit('switchTab', tab);
			},
		},
	}
</script>