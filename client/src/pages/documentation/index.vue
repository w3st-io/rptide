<template>
	<BContainer class="w-100 py-5">
		<!-- Authorization -->
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
					<h3>
						<span class="px-2 bg-primary text-dark rounded">Authorization</span>
					</h3>
					<p>
						You can retrieve your API key from the <a href="/dashboard/unset/api/5/1">dashboard</a>.
					</p>
				</BCol>
			</BRow>

			<!-- [REST-API] -->
			<BRow>
				<BCol cols="12">
					<hr class="bg-primary">
					<h2 class="mb-3 pb-1 text-primary">
						REST API
					</h2>
				</BCol>

				<BCol cols="12">
					<p>Pass your API Private Key like below.</p>
					<VueJsonPretty
						:data="{
							authorization: 'Bearer < your-api-private-key-here >'
						}"
						class="mb-4 p-2 text-light bg-code"
					/>
				</BCol>
			</BRow>
		</BCard>

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
					<h3>
						<span class="px-2 bg-primary text-dark rounded">Products</span>
					</h3>
					<p>
						Maintain your products with RpTide and lose the stress of managing them on your platforms.
					</p>
				</BCol>
			</BRow>

			<!-- [JSON-EXAMPLES] -->
			<BRow>
				<BCol cols="12">
					<hr class="bg-primary">
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

			<!-- [OFFICIAL-SITE] -->
			<BRow>
				<BCol cols="12">
					<hr class="bg-primary">
					<h2 class="mb-3 pb-1 text-primary">
						On Official Site
					</h2>
				</BCol>

				<BCol cols="12" md="6">
					<p class="mb-3">Create a Product</p>
				</BCol>

				<BCol cols="12" md="6">
					<p v-html="pData.productSummary"></p>
				</BCol>
			</BRow>

			<!-- [REST-API] -->
			<BRow>
				<BCol cols="12">
					<hr class="bg-primary">
					<h2 class="mb-3 pb-1 text-primary">
						REST API
					</h2>
				</BCol>

				<BCol cols="12" md="6">
					<p class="mb-3">Retrieve All Product</p>
				</BCol>

				<BCol cols="12" md="6">
					<p>
						<code class="p-1 bg-code">
							POST /public-api/product/read-all/:limit/:page
						</code>
					</p>
				</BCol>
			</BRow>
		</BCard>

		<!-- Product Option -->
		<BCard
			id="product-option"
			bg-variant="dark"
			text-variant="light"
			border-variant=""
			class="mb-5 shadow"
		>
			<!-- [HEADER] -->
			<BRow>
				<BCol cols="12">
					<h3>
						<span class="px-2 bg-primary text-dark rounded">Product Option</span>
					</h3>
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
						Object Example
					</h2>
				</BCol>
			
				<BCol cols="12" md="6">
					<h6 class="mb-3">Example 1: For "Pizza Pie" Product</h6>
				</BCol>

				<BCol cols="12" md="6">
					<VueJsonPretty
						:data="productExample"
						class="mb-4 p-2 text-light bg-code"
					/>
				</BCol>

				<BCol cols="12" md="6">
					<h6 class="mb-3">Example 2: For "Computer Laptop" Product</h6>
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
	</BContainer>
</template>

<script>
	// [IMPORT] //
	import VueJsonPretty from 'vue-json-pretty'
	import 'vue-json-pretty/lib/styles.css'

	// [IMPORT] Personal //
	import pData from '../../defaults/pages/documentation'

	export default {
		components: {
			VueJsonPretty,
		},

		data() {
			return {
				pData: pData,

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
	}
</script>

<style lang="scss" scoped>
	@import 'src/assets/styles/style.scss';

	code { @extend .text-primary }

	.bg-code {
		background-color: rgba(127.5, 127.5, 127.5, 0.2) !important;
	}
</style>