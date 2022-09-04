<template>
<div>
	<!-- [TAB-BUTTON] Web App -->
	<BRow class="pt-3">
		<BCol cols="12">
			<h5 class="text-center text-primary">Selected Web App</h5>
			<!-- Dropdown Select -->
			<Current class="mb-2" />
			<h6 class="mb-3 small text-center text-muted">
				{{ $store.state.dashboard.webApp }}
			</h6>

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
	<BRow class="pb-3">
		<BCol cols="12">
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
		</BCol>
	
		<BCol cols="12">
			<BButton
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
		</BCol>

		<BCol cols="12">
			<BButton
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
		</BCol>
	</BRow>
</div>
</template>

<script>
import Current from '../../components/webApps/Current'

export default {
	components: {
		Current
	},

	methods: {
		switchTab(tab) {
			this.$emit('switchTab', tab)
		},
	},
}
</script>