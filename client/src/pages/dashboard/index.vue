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
				cols="9" md="10"
				class="bg-dark right-content"
			>
				<!-- [TAB] Web Contents -->
				<WebContent v-if="$route.params.tab == 'web-content'" />
				
				<!-- [TAB] Products -->
				<Product v-if="$route.params.tab == 'product'" />

				<!-- [TAB] Product Options -->
				<ProductOptions v-if="$route.params.tab == 'product-options'" />

				<!-- [ERROR] -->
				<BAlert v-if="error" variant="danger" show class="my-3">
					Error: {{ error }}
				</BAlert>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT]
	import validator      from 'validator';

	// [IMPORT] Personal
	import Left           from '../../components/dashboard/Left';
	import Product        from '../../components/dashboard/Product';
	import ProductOptions from '../../components/dashboard/ProductOptions';
	import WebContent     from '../../components/dashboard/WebContent';
	import router         from '../../router';

	export default {
		data() {
			return {
				error: '',
			}
		},

		components: {
			Left,
			Product,
			ProductOptions,
			WebContent,
		},

		methods: {
			async switchTab(tab) {
				this.error = ''

				if (
					!this.$store.state.user.workspace.webApp ||
					!validator.isMongoId(this.$store.state.user.workspace.webApp)
				) {
					router.push({ name: 'web-app' });
				}
				
				router.push({
					name: 'dashboard',
					params: {
						tab: tab,
						sort: this.$route.params.sort,
						limit: this.$route.params.limit,
						page: this.$route.params.page
					},
				});
			},
		},

		async created() {
			if (!localStorage.usertoken) { router.push('/') }

			if (this.$store.state.user.verified == false) { router.push('/user') }

			if (!validator.isMongoId(this.$store.state.user.workspace.webApp)) {
				await this.switchTab('web-app')
			}
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