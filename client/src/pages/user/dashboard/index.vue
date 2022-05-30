<template>
	<BContainer fluid class="p-0 text-light">
		<PopUpWebApp
			v-if="this.$route.params.webapp == 'unset'"
			@updatePage="getPageData()"
		/>
		
		<BRow class="m-0 p-0">
			<!-- [HIDDEN][TABS-TOGGLE] -->
			<BCol cols="12" class="d-block d-lg-none p-0">
				<BButton
					variant="primary"
					class="w-100 rounded-0"
					@click="showTabs = !showTabs"
				><MenuIcon /></BButton>
			</BCol>

			<!-- [LEFT] Navigation -->
			<BCol
				v-if="showTabs"
				cols="12" lg="2"
				class="p-0 px-3 border-right border-left-0 border-primary bg-dark"
			>
				<!-- [TAB-BUTTON] Web App -->
				<BRow class="mb-3 py-3 bg-primary">
					<BCol cols="12" class="">
						<SelectWebApp
							@updatePage="$emit('updatePage')"
							class="mb-3"
						/>

						<BButton
							variant="none"
							pill
							size="lg"
							class="w-100"
							:class="{
								'btn-dark': $route.params.tab == 'web-app',
								'btn-outline-dark': $route.params.tab != 'web-app',
							}"
							@click="switchTab('web-app')"
						>Web Apps</BButton>
					</BCol>
				</BRow>

				<!-- [TAB-BUTTON] Content -->
				<BRow class="pb-3">
					<BCol cols="12">
						<h6 class="mb-3 text-center text-light">Web Content</h6>
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
				</BRow>

				<!-- [TATAB-BUTTONBS] Commerce -->
				<BRow class="pb-3">
					<BCol cols="12">
						<h6 class="mb-3 text-center text-light">Commerce</h6>
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
				cols="12" lg="10"
				class="bg-dark right-content"
			>
				<!-- [TAB] Web App -->
				<WebApp
					v-if="$route.params.tab == 'web-app'"
				/>

				<!-- [TAB] Product Options -->
				<WebContent
					v-if="$route.params.tab == 'web-content'"
					:webApp="$route.params.webapp"

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
	import { MenuIcon } from 'vue-feather-icons'

	// [IMPORT] Personal //
	import Product from '@/components/dashboard/Product'
	import ProductOptions from '@/components/dashboard/ProductOptions'
	import SelectWebApp from '@/components/dashboard/SelectWebApp.vue'
	import WebApp from '@/components/dashboard/WebApp'
	import WebContent from '@/components/dashboard/WebContent'
	import PopUpWebApp from '@/components/popups/WebApp'
	import defaultData from '@/defaults/companyInfo'
	import router from '@/router'
	import PageService from '@/services/PageService'

	export default {
		data() {
			return {
				defaultData,

				loading: true,
				resData: {},
				error: '',

				webApp: this.$route.params.webapp,
				tab: this.$route.params.tab,
				sort: parseInt(this.$route.params.sort),
				limit: parseInt(this.$route.params.limit),
				page: parseInt(this.$route.params.page),

				showTabs: true,
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
			MenuIcon,
			Product,
			ProductOptions,
			SelectWebApp,
			WebApp,
			WebContent,
			PopUpWebApp,
		},

		methods: {
			async setSelectedWebApp() {
				if (this.webApp == 'unset' && localStorage.selectedWebApp) {
					this.webApp = localStorage.selectedWebApp

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
			},

			async getPageData() {
				this.loading = true
				
				this.resData = await PageService.s_user_dashboard({
					webapp: this.webApp,
					tab: this.tab,
					sort: this.sort,
					limit: this.limit,
					page: this.page,
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

				router.push({
					name: 'user_dashboard',
					params: {
						tab: this.tab,
						sort: parseInt(this.sort),
						limit: parseInt(this.limit),
						page: parseInt(this.page),
					},
				})

				await this.getPageData()
			},
		},

		async created() {
			if (!this.$store.state.user.decoded.verifed) { router.push('user') }

			await this.setSelectedWebApp()

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