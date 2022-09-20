<template>
	<div class="px-5 py-5">
		<BRow>
			<BCol cols="12">
				<BRow>
					<BCol cols="12" md="9">
						<h3 class="text-primary">Products</h3>
					</BCol>

					<!-- Create Product Button -->
					<BCol cols="12" md="3" class="text-right">	
						<RouterLink to="/product/create">
							<BButton
								variant="success"
								class="w-100 w-sm-auto"
								style="max-width: 561px;"
								pill
							>+ Create</BButton>
						</RouterLink>
					</BCol>

					<BCol cols="12">
						<BCol cols="12">
							<h6 class="my-3 text-right text-light">
								{{ products.length }}
								/
								<span>
									<RouterLink to="/user">
										<BButton size="sm" class="ml-3">Upgrade</BButton>
									</RouterLink>
								</span>
							</h6>
						</BCol>
					</BCol>

					<BCol
						v-for="p in products"
						:key="p._id"
						cols="12" md="6" lg="4" xl="3"
						class="d-flex align-items-stretch"
					>
						<BCard
							text-variant="light"
							bg-variant="dark"
							border-variant="secondary"
							no-body
							class="mb-4 product-card"
							@click="routerPush(`/product/read/${p._id}`)"
						>
							<BCardImg
								top
								:src="
									p.images[0] ||
									'https://images2.imgbox.com/d8/e9/1AZVOkkt_o.png'
								"
								class="
									border-bottom
									border-primary
									product-img
								"
							/>

							<BCardHeader>
								<!-- Name -->
								<h3
									class="
										m-0
										text-uppercase
										text-primary
									"
								>{{ p.name }}</h3>
							</BCardHeader>

							<BCardBody>
								<!-- Price -->
								<h6 class="small text-secondary">
									Price
								</h6>
								<h6 class="text-light text-uppercase">
									${{ p.price.string }}
								</h6>
							
								<!-- Description -->
								<h6 class="small text-secondary">
									Description
								</h6>
								<h6 class="mb-2">
									{{ p.description }}
								</h6>
							</BCardBody>
						</BCard>
					</BCol>
				</BRow>
			</BCol>
		</BRow>
	</div>
</template>

<script>
	import axios from 'axios';

	import router from '../../router';

	export default {
		data() {
			return {
				authAxios: axios.create({
					baseURL: '/api/product',
					headers: {
						user_authorization: `Bearer ${localStorage.usertoken}`
					}
				}),

				products: [],
			}
		},

		methods: {
			routerPush(r) { router.push(r) }
		},

		async created() {
			try {
				const resData = await this.authAxios.post('/find', {
					webApp: this.$store.state.user.workspace.webApp
				})

				if (resData.status) {
					this.products = resData.data.products
				}
			}
			catch (err) {
				this.error = err
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

	.product-card:hover {
		background-color: rgba(127.5, 127.5, 127.5, 0.50) !important;
		transition: .5s;
	}

	.product-img {
		float: left;
		width:  100%;
		height: 200px;
		object-fit: cover;
	}
</style>