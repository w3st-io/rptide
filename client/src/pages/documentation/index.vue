<template>
	<BRow class="w-100">
		<BCol cols="3" lg="3" xl="2">
			<div class="w-100 h-100 px-3 py-5 bg-dark border-right border-primary">
				<h6 class="mb-3 text-center text-light">
					Documentation
				</h6>

				<BButton
					pill
					:variant="active == 'authorization' ? 'primary' : 'outline-primary'"
					class="w-100 mb-3"
					@click="active = 'authorization'"
				>Authorization</BButton>

				<BButton
					pill
					:variant="active == 'web-content' ? 'primary' : 'outline-primary'"
					class="w-100 mb-3"
					@click="active = 'web-content'"
				>Web-Content</BButton>

				<BButton
					v-if="node_env == 'development'"
					pill
					:variant="active == 'products' ? 'primary' : 'outline-primary'"
					class="w-100 mb-3"
					@click="active = 'products'"
				>Products</BButton>

				<BButton
					v-if="node_env == 'development'"
					pill
					:variant="active == 'product-options' ? 'primary' : 'outline-primary'"
					class="w-100 mb-3"
					@click="active = 'product-options'"
				>Product-options</BButton>
			</div>
		</BCol>
	
		<BCol cols="9" lg="9" xl="10">
			<BContainer class="py-5">
				<CAuthorization v-if="active == 'authorization'" />
				<CWebContent v-if="active == 'web-content'" />
				<CProducts  v-if="node_env == 'development' && active == 'products'" />
				<CProductOptions  v-if="node_env == 'development' && active == 'product-options'" />
			</BContainer>
		</BCol>
	</BRow>
</template>

<script>
	// [IMPORT] Personal
	import CAuthorization from '../../components/documentation/CAuthorization.vue';
	import CProducts from '../../components/documentation/CProducts.vue';
	import CProductOptions from '../../components/documentation/CProductOptions.vue';
	import CWebContent from '../../components/documentation/CWebContent.vue';

	export default {
		components: {
			CAuthorization,
			CProducts,
			CProductOptions,
			CWebContent,
		},

		data() {
			return {
				node_env: localStorage.node_env,
				active: 'authorization'
			}
		},
	}
</script>