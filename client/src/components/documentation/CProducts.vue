<template>
	<!------------------------------ Products ------------------------------>
	<BCard
		bg-variant="dark"
		text-variant="light"
		border-variant=""
		id="product"
		class="mb-5 shadow"
	>
		<!-- [HEADER] -->
		<BRow>
			<BCol cols="12">
				<h1>
					<span class="px-2 bg-primary text-dark rounded">Products</span>
				</h1>
				<p>
					Maintain your products with RpTide and lose the stress of managing them on your platforms.
				</p>
			</BCol>
		</BRow>

		<BRow>
			<!-- [OFFICIAL-SITE] -->
			<BCol cols="12" md="6">
				<h2 class="mb-3 pb-1 text-primary">
					On Official Site
				</h2>
				<p class="mb-3">Create a Product</p>
			</BCol>

			<!-- [REST-API] -->
			<BCol cols="12" md="6">
				<h2 class="mb-3 pb-1 text-primary">
					REST API
				</h2>
				<p class="mb-3">Retrieve All Product</p>
				<p>
					<code class="p-1 bg-code">
						POST /public-api/product/read-all/:limit/:page
					</code>
				</p>
			</BCol>
		</BRow>


		<!-- [JSON-EXAMPLES] -->
		<BRow>
			<BCol cols="12">
				<h2 class="mb-3 pb-1 text-primary">
					Object Example
				</h2>
			</BCol>

			<!-- Table -->
			<BCol cols="12" md="6" class="bg-dark">
				<BTableSimple
					borderless
					striped
					class="border border-primary text-light bg-code"
				>
					<BThead class="border-bottom border-primary">
						<BTr class="">
							<BTh><u>Property</u></BTh>
							<BTh><u>Type</u></BTh>
							<BTh><u>Definition</u></BTh>
						</BTr>
					</BThead>
			
					<BTbody class="">
						<BTr>
							<BTd><code class="p-1 bg-code">name</code></BTd>
							<BTd>String</BTd>
							<BTd>Name of the product</BTd>
						</BTr>

						<BTr>
							<BTd><code class="p-1 bg-code">price</code></BTd>
							<BTd>Number</BTd>
							<BTd>
								The price of the product in pennies
								<br>
								(100 = $1)
							</BTd>
						</BTr>

						<BTr>
							<BTd><code class="p-1 bg-code">variants</code></BTd>
							<BTd>Array</BTd>
							<BTd>
								Array of objects containing properties of the variant.
							</BTd>
						</BTr>
					</BTbody>
				</BTableSimple>
			</BCol>

			<!-- JSON Example -->
			<BCol cols="12" md="6">
				<div class="bg-code text-light">
					<VueJsonPretty
						:data="productExample"
						class="p-2 text-light"
					/>
				</div>
			</BCol>
		</BRow>
	</BCard>
</template>

<script>
	// [IMPORT]
	import VueJsonPretty from 'vue-json-pretty';
	import 'vue-json-pretty/lib/styles.css';

	export default {
		data() {
			return {
				productExample: {
					executed: true,
					status: true,
					products: [
						{
							price: {
								number: 10,
								inPennies: 1000,
								string: '10.00',
								dollars: '10',
								cents: '00'
							},
							isSubscription: false,
							category: 'food',
							subCategories: ['italian'],
							images: [
								'https://www.example.com/pizza-img.jpg'
							],
							totalInStock: 1,
							requiredProductOptions: [],
							optionalProductOptions: [],
							_id: '615259b1fd30c8003613a37f',
							user: '62523ec6ef567a00562cb503',
							name: 'Pizza Pie',
							description: 'Who doesn\'t like pizza?',
							createdAt: '2021-09-27T23:54:25.232Z',
						}
					]
				}
			}
		},

		components: {
			VueJsonPretty,
		},
	}
</script>