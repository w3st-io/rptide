<template>
	<BContainer class="my-5">
		<!-- Informative Message -->
		<Alert variant="info" :message="message" />

		<!-- Create Product -->
		<BCard
			v-if="!loading"
			bg-variant="dark"
			text-variant="light"
			class="mb-3 shadow"
		>
			<BRow>
				<BCol cols="12">
					<h3 class="text-primary">Create a Product</h3>
					<hr class="border-primary">
				</BCol>

				<BCol cols="12" md="6" lg="3">
					<!-- Image -->
					<label for="" class="text-primary">Image Url</label>
					<input
						v-model="product.images[0]"
						type="text"
						placeholder="https://www.example.com/image.jpg"
						class="input-style"
					>
					<img
						:src="
							product.images[0] ||
							'https://images2.imgbox.com/d8/e9/1AZVOkkt_o.png'
						"
						alt="No Image Yet"
						class="w-100 mb-3 border border-primary rounded"
					>
				</BCol>

				<BCol cols="12" md="6" lg="6">
					<BRow>
						<!-- Name -->
						<BCol cols="12">
							<label for="" class="text-primary">Name</label>
							<input
								v-model="product.name"
								type="text"
								placeholder="Pizza Pie"
								class="input-style"
							>
						</BCol>

						<!-- Dollar Amount -->
						<BCol cols="6" class="pr-0">
							<label for="" class="text-primary">Dollars</label>
							<input
								v-model="product.price.dollars"
								type="number"
								placeholder="20"
								class="input-style"
								min="0"
							>
						</BCol>
							
						<BCol cols="1" class="p-0">
							<h6 class="m-0 mt-5 text-center">.</h6>
						</BCol>

						<!-- Cent Amount -->
						<BCol cols="5" class="pl-0">
							<label for="" class="text-primary">Cents</label>
								
							<input
								v-model="product.price.cents"
								type="number"
								placeholder="50 (Must be 2 digits)"
								maxlength="2"
								class="input-style"
								min="0"
								max="99"
							>
						</BCol>

						<!-- Description -->
						<BCol cols="12">
							<label for="" class="text-primary">Description</label>
							<input
								v-model="product.description"
								type="text"
								placeholder="Who doesnt love pizza?"
								class="input-style"
							>
						</BCol>
					</BRow>
				</BCol>

				<!-- [RIGHT] -->
				<BCol cols="12" md="12" lg="3">
					<!-- Category -->
					<label for="" class="text-primary">Category</label>
					<input
						v-model="product.category"
						type="text"
						placeholder="Food"
						class="input-style"
					>
				</BCol>

				<!-- Submit -->
				<BCol cols="12">
					<BButton
						variant="primary"
						class="w-100"
						@click="submitForm()"
					>Submit</BButton>
				</BCol>
			</BRow>
		</BCard>

		<!-- Submit -->
		<Alert v-if="error" variant="danger" :message="error" />
	</BContainer>
</template>

<script>
	import Alert from '@/components/inform/Alert'
	import ProductService from '@/services/ProductService'
	import router from '@/router'

	export default {
		components: {
			Alert,
		},

		data() {
			return {
				loading: true,
				resData: {},
				error: '',
				message: 'We do not support uploading images yet. please provide a URL for images.',

				product: {
					name: '',
					price: {
						dollars: '0',
						cents: '0',
					},
					category: '',
					description: '',
					images: [],
				},
			}
		},

		methods: {
			async submitForm() {
				this.resData = await ProductService.s_create({
					product: this.product
				})

				if (this.resData.status) {
					router.push({
						name: 'dashboard',
						params: {
							tab: 'product',
							sort: 0,
							limit: 5,
							page: 1,
						}
					})
				}
				else { this.error = this.resData.message }
			},
		},

		async created() {
			this.loading = false
		}
	}
</script>

<style lang="scss" scoped>
	@import 'src/assets/styles/style.scss';
	
	.input-style {
		@extend .form-control;
		@extend .mb-3;
		@extend .bg-dark;
		@extend .text-light;
		@extend .border-secondary;
	}
</style>