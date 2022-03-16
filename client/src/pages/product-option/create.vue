<template>
	<BContainer class="my-5">
		<BCard bg-variant="dark" text-variant="light">
			<BRow>
				<BCol cols="12" md="9">
					<!-- [HEADER] -->
					<BRow>
						<BCol cols="12">
							<h3 class="text-primary">Create Product Option</h3>
							<hr class="bg-primary">
						</BCol>
					</BRow>
					
					<BRow>
						<BCol cols="12">
							<h6 class="mb-3 text-light">Name</h6>
							<input
								v-model="productOption.name"
								type="text"
								placeholder="Toppings"
								class="
									form-control
									text-light
									bg-dark
									border-secondary
								"
							>
							<hr>
						</BCol>
					</BRow>

					<BRow>
						<BCol cols="12">
							<h5 class="text-light">Product Option Variants</h5>
						</BCol>
					</BRow>

					<!-- Titles -->
					<BRow class="mb-3">
						<BCol cols="6">
							<h6 class="m-0 text-light">Name</h6>
						</BCol>

						<BCol cols="3">
							<h6 class="m-0 text-light">Dollars</h6>
						</BCol>

						<BCol cols="3">
							<h6 class="m-0 text-light">Cents</h6>
						</BCol>
					</BRow>

					<!-- Placeholder -->
					<BRow v-if="productOption.variants.length < 1" class="mb-3">
						<BCol cols="6" md="6">
							<input
								type="text"
								class="
									form-control
									text-light
									bg-dark
									border-secondary
								"
								placeholder="Olives"
								disabled
								style="border-style: dashed;"
							>
						</BCol>

						<BCol cols="3" md="3">
							<input
								type="Number"
								class="
									form-control
									text-light
									bg-dark
									border-secondary
								"
								placeholder="1"
								disabled
								style="border-style: dashed;"
							>
						</BCol>

						<BCol cols="3" md="3">
							<input
								type="Number"
								class="
									form-control
									text-light
									bg-dark
									border-secondary
								"
								placeholder="50"
								disabled
								style="border-style: dashed;"
							>
						</BCol>
					</BRow>

					<!-- Product Options -->
					<BRow
						v-for="(p, i) in productOption.variants"
						:key="i"
						class="mb-3"
					>
						<!-- [NAME] -->
						<BCol cols="6" md="6">
							<input
								v-model="p.name"
								type="text"
								placeholder="Olives"
								class="
									form-control
									text-light
									bg-dark
									border-secondary
								"
							>
						</BCol>

						<!-- [DOLLARS] -->
						<BCol cols="3" md="3">
							<input
								v-model="p.dollars"
								type="number"
								placeholder="0"
								class="
									form-control
									text-light
									bg-dark
									border-secondary
								"
								min="0"
							>
						</BCol>

						<!-- [CENTS] -->
						<BCol cols="3" md="3">
							<input
								v-model="p.cents"
								type="number"
								placeholder="0"
								class="
									form-control
									text-light
									bg-dark
									border-secondary
								"
								min="0"
								max="99"
							>
						</BCol>
					</BRow>

					<BButton
						variant="primary"
						class="mb-3"
						@click="addProductVariant()"
					>
						<span class="h5">+ Add Variant</span>
					</BButton>

					<BButton
						variant="primary"
						class="w-100 mb-3"
						@click="submitForm()"
					>
						<span class="h5">Create Product Variant</span>
					</BButton>
				</BCol>

				<!-- [SIDE] -->
				<BCol cols="12" md="3">
					<hr class="bg-secondary">
					{{ productOption }}
				</BCol>
			</BRow>
		</BCard>
	</BContainer>
</template>

<script>
	import ProductOptionService from '@/services/user/ProductOptionService'

	export default {
		data() {
			return {
				productOption: {
					name: '',
					variants: [],
				}
			}
		},

		methods: {
			addProductVariant() {
				this.productOption.variants.push({
					name: '',
					price: {
						dollars: 0,
						cents: 0,
					},
				})
			},

			async submitForm() {
				this.resData = await ProductOptionService.s_create({
					productOption: this.productOption
				})

				console.log(this.resData);
			},
		},
	}
	</script>