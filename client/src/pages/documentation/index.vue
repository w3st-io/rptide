<template>
	<BRow class="w-100">
		<BCol lg="3" xl="2" class="bg-dark border-right border-primary">

		</BCol>
	
		<BCol cols="9" xl="10">
			<BContainer class="py-5">
				<CAuthorization />
				<CProducts />
				<CProductOptions />
			</BContainer>
		</BCol>
	</BRow>
</template>

<script>
	// [IMPORT] Personal
	import CAuthorization from '../../components/documentation/CAuthorization.vue';
	import CProducts from '../../components/documentation/CProducts.vue';
	import CProductOptions from '../../components/documentation/CProductOptions.vue';

	export default {
		components: {
			CAuthorization,
			CProducts,
			CProductOptions,
		},
	}
</script>