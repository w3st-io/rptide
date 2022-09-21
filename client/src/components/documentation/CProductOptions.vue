<template>
	<!-- Product Option -->
	<BCard
		id="product-option"
		bg-variant="dark"
		text-variant="light"
		border-variant="secondary"
		class="mb-5 shadow"
	>
		<!-- [HEADER] -->
		<BRow>
			<BCol cols="12">
				<h1>
					<span class="px-2 bg-primary text-dark rounded">Product-options</span>
				</h1>
				<p>
					Products may have additional properties that a customer may choose (or be required to choose), which is handled by creating a <code class="p-1 text-primary bg-code">productOption</code>. Merchants are able to attach them to a <code class="p-1 text-primary bg-code">product</code> by selecting it in the product creation page.
				</p>
			</BCol>
		</BRow>
		
		<!-- [JSON-EXAMPLES] -->
		<BRow>
			<BCol cols="12">
				<hr class="bg-primary">
				<h2 class="mb-3 pb-1 text-primary">
					Object Examples
				</h2>
			</BCol>

			<BCol cols="12" md="6">
				<p class="mb-3">For "Computer Laptop" Product</p>
			</BCol>

			<BCol cols="12" md="6">
				<VueJsonPretty
					:data="{
						name: 'Graphics',
						variants: [
							{
								name: 'none',
								price: 0
							},
							{
								name: 'AMDD',
								price: 5000
							},
						],
						createdAt: '2021-08-31T18:48:01.360+00:00',
					}"
					class="mb-4 p-2 text-light bg-code"
				/>
			</BCol>
		</BRow>
	</BCard>
</template>

<script>
	// [IMPORT]
	import VueJsonPretty from 'vue-json-pretty';
	import 'vue-json-pretty/lib/styles.css';

	export default {
		components: {
			VueJsonPretty,
		},
	}
</script>