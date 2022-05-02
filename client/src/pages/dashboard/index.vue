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
						<h6 class="mb-3 text-center text-dark">Selected Web App</h6>

						<SelectWebApp
							@updatePage="$emit('updatePage')"
							class="mb-3"
						/>

						<BButton
							variant="none"
							class="w-100"
							:class="{
								'btn-dark': $route.params.tab == 'web-app',
								'btn-outline-dark': $route.params.tab != 'web-app',
							}"
							@click="switchTab('web-app')"
						>Web Apps</BButton>
					</BCol>
				</BRow>

				<!-- [TAB-BUTTON] Pages -->
				<BRow class="pb-3">
					<BCol cols="12">
						<h6 class="mb-3 text-center text-light">Pages</h6>
						<BButton
							variant="none"
							class="w-100 mb-3"
							:class="{
								'btn-primary': $route.params.tab == 'static-page',
								'btn-outline-primary': $route.params.tab != 'static-page',
							}"
							@click="switchTab('static-page')"
						>Static Pages</BButton>

						<BButton
							variant="none"
							class="w-100"
							:class="{
								'btn-primary': $route.params.tab == 'dynamic-page',
								'btn-outline-primary': $route.params.tab != 'dynamic-page',
							}"
							@click="switchTab('dynamic-page')"
						>Dynamic Pages</BButton>
					</BCol>
				</BRow>

				<!-- [TAB-BUTTON] Content -->
				<BRow class="pb-3">
					<BCol cols="12">
						<h6 class="mb-3 text-center text-light">Content</h6>
						<BButton
							variant="none"
							class="w-100 mb-3"
							:class="{
								'btn-primary': $route.params.tab == 'section-text',
								'btn-outline-primary': $route.params.tab != 'section-text',
							}"
							@click="switchTab('section-text')"
						>Section Texts</BButton>
					
						<BButton
							variant="none"
							class="w-100"
							:class="{
								'btn-primary': $route.params.tab == 'blog-post',
								'btn-outline-primary': $route.params.tab != 'blog-post',
							}"
							@click="switchTab('blog-post')"
						>Blog Posts</BButton>
					</BCol>
				</BRow>

				<!-- [TATAB-BUTTONBS] Commerce -->
				<BRow class="pb-3">
					<BCol cols="12">
						<h6 class="mb-3 text-center text-light">Commerce</h6>
						<BButton
							variant="none"
							class="w-100 mb-3"
							:class="{
								'btn-primary': $route.params.tab == 'product',
								'btn-outline-primary': $route.params.tab != 'product',
							}"
							@click="switchTab('product')"
						>Products</BButton>
					
						<BButton
							variant="none"
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

				<!-- [TAB] Products -->
				<Product
					v-if="$route.params.tab == 'product'"
					:products="products"
					:productsLimit="productsLimit"
				/>
				
				<!-- [TAB] Product Options -->
				<ProductOptions
					v-if="$route.params.tab == 'product-options'"
					:productOptions="productOptions"
					:productOptionsLimit="productOptionsLimit"
				/>

				<!-- [ERROR] -->
				<BRow>
					<BCol cols="12">
						<h6 class="text-danger">{{ error }}</h6>
					</BCol>
				</BRow>
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
	import PopUpWebApp from '@/components/popups/WebApp'
	import defaultData from '@/defaults/companyInfo'
	import router from '@/router'
	import PageService from '@/services/PageService'
	import UserService from '@/services/user/UserService'

	export default {
		data() {
			return {
				webApp: this.$route.params.webapp,
				tab: this.$route.params.tab,
				sort: parseInt(this.$route.params.sort),
				limit: parseInt(this.$route.params.limit),
				page: parseInt(this.$route.params.page),

				defaultData: defaultData,

				loading: true,
				showTabs: true,
				dashboardHeight: '',
				error: '',

				resData: {},
				user: {},

				blogPosts: [],
				blogPostsLimit: 0,

				products: [],
				productsLimit: 0,

				productOptions: [],
				productOptionsLimit: 0,

				sectionTexts: [],
				sectionTextsLimit: 0,
			}
		},

		components: {
			MenuIcon,
			Product,
			ProductOptions,
			SelectWebApp,
			WebApp,
			PopUpWebApp,
		},

		methods: {
			async generateApiKey() {
				this.resData = await UserService.s_generateApiKey()

				if (this.resData.status) { this.user = this.resData.user }
				else { this.error = this.resData.message }
			},

			async getPageData() {
				this.loading = true
				
				this.resData = await PageService.s_dashboard({
					webapp: this.webApp,
					tab: this.tab,
					sort: this.sort,
					limit: this.limit,
					page: this.page,
				})

				if (this.resData.status) {
					// [SECTION-TEXTS] //
					if (this.resData.sectionTexts) {
						this.sectionTexts = this.resData.sectionTexts

						this.sectionTextsLimit = this.resData.limit.sectionText[
							this.resData.apiSubscriptionTier
						]
					}

					// [BLOG-POSTS] //
					if (this.resData.blogPosts) {
						this.blogPosts = this.resData.blogPosts

						this.blogPostsLimit = this.resData.limit.blogPost[
							this.resData.apiSubscriptionTier
						]
					}

					// [PRODUCTS] //
					if (this.resData.products) {
						this.products = this.resData.products

						this.productsLimit = this.resData.limit.product[
							this.resData.apiSubscriptionTier
						]
					}
					
					// [PRODUCT-OPTION] //
					if (this.resData.productOptions) {
						this.productOptions = this.resData.productOptions

						this.productOptionsLimit = this.resData.limit.productOptions[
							this.resData.apiSubscriptionTier
						]
					}

					if (this.resData.user) {
						this.user = this.resData.user
					}
				}
				else { this.error = this.resData.message }
				
				this.loading = false
			},

			async switchTab(tab) {
				this.tab = tab

				router.push({
					name: 'dashboard',
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
			if (this.webApp == 'unset' && localStorage.selectedWebApp) {
				this.webApp = localStorage.selectedWebApp

				router.push({
					name: 'dashboard',
					params: {
						webapp: localStorage.selectedWebApp,
						tab: this.tab,
						sort: parseInt(this.sort),
						limit: parseInt(this.limit),
						page: parseInt(this.page),
					},
				})
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