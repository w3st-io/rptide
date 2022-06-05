<template>
	<BContainer fluid class="p-0 text-light">
		<BRow class="m-0 p-0">
			<!-- [LEFT] Navigation -->
			<BCol
				cols="3" md="2"
				class="p-0 px-3 border-right border-left-0 border-primary bg-dark"
			>
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
						
						<hr class="border-primary">
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
			</BCol>

			<!-- [RIGHT][CONTENT] -->
			<BCol
				v-if="!loading"
				cols="9" md="10"
				class="bg-dark right-content"
			>
				<!-- [TAB] Web App -->
				<WebApp
					v-if="$route.params.tab == 'web-app'"
				/>

				<!-- [TAB] Product Options -->
				<WebContent
					v-if="$route.params.tab == 'web-content'"
					:webApp="$store.state.dashboard.webApp"

				/>
				
				<!-- [TAB] Products -->
				<Product
					v-if="$route.params.tab == 'product'"
					:products="pageData.products"
					:productsLimit="pageData.productsLimit"
				/>

				<!-- [TAB] Product Options -->
				<ProductOptions
					v-if="$route.params.tab == 'product-options'"
					:productOptions="pageData.productOptions"
					:productOptionsLimit="pageData.productOptionsLimit"
				/>

				<!-- [ERROR] -->
				<BAlert v-if="error" variant="danger" show class="my-3">
					Error: {{ error }}
				</BAlert>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] //
	import validator from 'validator'

	// [IMPORT] Personal //
	import Product        from '../../../components/dashboard/Product'
	import ProductOptions from '../../../components/dashboard/ProductOptions'
	import WebContent     from '../../../components/dashboard/WebContent'
	import WebApp         from '../../../components/dashboard/WebApp'
	import Current        from '../../../components/webApps/Current'
	import defaultData    from '../../../defaults/companyInfo'
	import router         from '../../../router'
	import PageService    from '../../../services/PageService'

	export default {
		data() {
			return {

				defaultData,

				loading: true,
				resData: {},
				error: '',

				tab: this.$route.params.tab,
				sort: parseInt(this.$route.params.sort),
				limit: parseInt(this.$route.params.limit),
				page: parseInt(this.$route.params.page),

				dashboardHeight: '',

				pageData: {
					products: [],
					productsLimit: 0,

					productOptions: [],
					productOptionsLimit: 0,
				},
			}
		},

		components: {
			Product,
			ProductOptions,
			WebApp,
			Current,
			WebContent,
		},

		methods: {
			async getPageData() {
				this.loading = true
				
				this.resData = await PageService.s_user_dashboard({
					webapp: localStorage.selectedWebApp,
					tab: this.tab,
					sort: parseInt(this.sort),
					limit: parseInt(this.limit),
					page: parseInt(this.page),
				})

				if (this.resData.status) {
					// [PRODUCTS] //
					if (this.resData.products) {
						this.pageData.products = this.resData.products

						this.pageData.productsLimit = this.resData.limit.product[
							this.resData.apiSubscriptionTier
						]
					}
					
					// [PRODUCT-OPTION] //
					if (this.resData.productOptions) {
						this.pageData.productOptions = this.resData.productOptions

						this.pageData.productOptionsLimit = this.resData.limit.productOptions[
							this.resData.apiSubscriptionTier
						]
					}
				}
				else { this.error = this.resData.message }
				
				this.loading = false
			},

			async switchTab(tab) {
				this.error = ''
				this.tab = tab

				if (validator.isMongoId(this.$store.state.dashboard.webApp)) {
					router.push({
						name: 'user_dashboard',
						params: {
							webapp: localStorage.selectedWebApp,
							tab: this.tab,
							sort: parseInt(this.sort),
							limit: parseInt(this.limit),
							page: parseInt(this.page),
						},
					})
				}
				else {
					router.push({
						name: 'user_dashboard',
						params: {
							webapp: localStorage.selectedWebApp,
							tab: 'web-app',
							sort: parseInt(this.sort),
							limit: parseInt(this.limit),
							page: parseInt(this.page),
						},
					})
				}

				await this.getPageData()
			},
		},

		async created() {
			if (!localStorage.usertoken) { router.push('/') }

			if (this.$store.state.user.verified == false) { router.push('/user') }

			if (!validator.isMongoId(this.$store.state.dashboard.webApp)) {
				await this.switchTab('web-app')
			}

			await this.getPageData()
		},
	}
</script>

<style lang="scss" scoped>
	.transparent {
		background-color: rgba(255, 255, 255, 0) !important;
	}

	.right-content {
		min-height: 500px !important;
	}
</style>