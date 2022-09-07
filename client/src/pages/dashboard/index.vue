<template>
	<BContainer fluid class="p-0 text-light">
		<BRow class="m-0 p-0">
			<!-- [LEFT] Navigation -->
			<BCol
				cols="3" md="2"
				class="py-5 border-right border-left-0 border-primary bg-dark"
			>
				<Left @switchTab="(t) => switchTab(t)" />
			</BCol>

			<!-- [RIGHT][CONTENT] -->
			<BCol
				v-if="!loading"
				cols="9" md="10"
				class="bg-dark right-content"
			>
				<!-- [TAB] Product Options -->
				<WebContent
					v-if="$route.params.tab == 'web-content'"
					:webApp="$store.state.user.workspace.webApp"

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
	import axios from 'axios';
	import validator from 'validator';

	// [IMPORT] Personal //
	import Left           from '../../components/dashboard/Left';
	import Product        from '../../components/dashboard/Product';
	import ProductOptions from '../../components/dashboard/ProductOptions';
	import WebContent     from '../../components/dashboard/WebContent';
	import router         from '../../router';

	export default {
		data() {
			return {
				authAxios: axios.create({
					baseURL: '/pages/dashboard/index',
					headers: {
						user_authorization: `Bearer ${localStorage.usertoken}`
					}
				}),

				loading: true,
				resData: {},
				error: '',

				pageData: {
					products: [],
					productsLimit: 0,

					productOptions: [],
					productOptionsLimit: 0,
				},
			}
		},

		components: {
			Left,
			Product,
			ProductOptions,
			WebContent,
		},

		methods: {
			async getPageData() {
				this.loading = true;

				this.resData = (
					await this.authAxios.get(`
						/${this.$store.state.user.workspace.webApp}
						/${this.$route.params.tab}
						/${this.$route.params.sort}
						/${this.$route.params.limit}
						/${this.$route.params.page}
					`)
				).data;

				if (this.resData.status) {
					// [PRODUCTS] //
					if (this.resData.products) {
						this.pageData.products = this.resData.products;

						this.pageData.productsLimit = this.resData.limit.product[
							this.resData.apiSubscriptionTier
						];
					}
					
					// [PRODUCT-OPTION] //
					if (this.resData.productOptions) {
						this.pageData.productOptions = this.resData.productOptions

						this.pageData.productOptionsLimit = this.resData.limit.productOptions[
							this.resData.apiSubscriptionTier
						];
					}
				}
				else { this.error = this.resData.message; }
				
				this.loading = false;
			},

			async switchTab(tab) {
				this.error = ''

				if (!validator.isMongoId(this.$store.state.user.workspace.webApp)) {
					router.push({ name: 'web-app' });
				}
				
				router.push({
					name: 'dashboard',
					params: {
						webapp: this.$store.state.user.workspace.webApp,
						tab: tab,
						sort: this.$route.params.sort,
						limit: this.$route.params.limit,
						page: this.$route.params.page
					},
				});

				await this.getPageData()
			},
		},

		async created() {
			if (!localStorage.usertoken) { router.push('/') }

			if (this.$store.state.user.verified == false) { router.push('/user') }

			if (!validator.isMongoId(this.$store.state.user.workspace.webApp)) {
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