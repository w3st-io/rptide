<template>
	<BContainer class="my-5">
		<!-- Informative Message -->
		<Alert variant="info" :message="message" />

		<BCard
			bg-variant="dark"
			text-variant="light"
			no-body
			class="shadow"
		>
			<BCardHeader v-if="product !== {}">
				<BRow>
					<BCol cols="10">
						<RouterLink to="/dashboard/product/0/5/1">
							<BButton
								variant="primary"
								size="sm"
								class=""
							>
								<h6 class="my-1">
									<ArrowLeftCircleIcon size="1.2x" class="m-0" />
									Back to Dashboard
								</h6>
							</BButton>
						</RouterLink>
					</BCol>

					<BCol cols="2">
						<BButton
							variant="outline-danger"
							class="w-100"
							@click="showConfirm = true"
						>Delete</BButton>

						<Confirm
							v-if="showConfirm"
							@xClicked="showConfirm = false"
							@yesClicked="deleteProduct()"
							@noClicked="showConfirm = false"
						/>
					</BCol>
				</BRow>
			</BCardHeader>

			<BCardBody v-if="!loading && !error">
				<!-- [PAGE-CONTENT] -->
				<BRow>
					<!-- [LEFT] -->
					<BCol cols="12" lg="3" xl="3">
						<BCard
							bg-variant="dark"
							border-variant="secondary"
							no-body
							class="mb-3"
							:class="{
								'border-warning border-dashed': edit.images
							}"
						>
							<!-- [HEADER] -->
							<BCardHeader>
								<BRow>
									<BCol md="7" cols="12">
										<h5 class="m-0 text-primary">Images</h5>
									</BCol>

									<BCol md="5" cols="12">
										<!-- [EDIT-BUTTON] -->
										<BButton
											variant="primary"
											size="sm"
											class="w-100 p-0"
											@click="edit.images = true"
										>Edit</BButton>
									</BCol>
								</BRow>
							</BCardHeader>

							<!-- [PRODUCT][IMAGES] -->
							<BCardBody>
								<!-- [CONTENT] -->
								<BRow class="pb-3">
									<BCol cols="12">
										<!-- [CURRENT] -->
										<BCarousel
											v-if="product.images.length > 0"
											id="carousel-1"
											:interval="4000"
											controls
											indicators
											class="mb-3"
											style="
												text-shadow: 1px 1px 2px #333;
												width: 100%;
												
											"
										>
											<!-- Text slides with image -->
											<BCarouselSlide
												v-for="(img, i) in product.images"
												:key="i"
												:img-src="img || 'https://images2.imgbox.com/d8/e9/1AZVOkkt_o.png'"
												class="carousel-img"
												style=""
											></BCarouselSlide>
										</BCarousel>

										<img
											v-if="product.images.length == 0"
											src="https://images2.imgbox.com/d8/e9/1AZVOkkt_o.png"
											class="w-100"
										>
									</BCol>
								
									<!-- [EDIT] -->
									<BCol v-if="edit.images" cols="12" class="mt-3">
										<input
											v-model="product.images[0]"
											type="text"
											placeholder="https://www.example.com/img.png"
											class="
												form-control
												mb-3
												bg-dark
												text-light
												border-secondary
											"
										>
										<input
											v-model="product.images[1]"
											type="text"
											placeholder="https://www.example.com/img.png"
											class="
												form-control
												mb-3
												bg-dark
												text-light
												border-secondary
											"
										>
										<input
											v-model="product.images[2]"
											type="text"
											placeholder="https://www.example.com/img.png"
											class="
												form-control
												mb-3
												bg-dark
												text-light
												border-secondary
											"
										>
										<input
											v-model="product.images[3]"
											type="text"
											placeholder="https://www.example.com/img.png"
											class="
												form-control
												mb-3
												bg-dark
												text-light
												border-secondary
											"
										>
										<input
											v-model="product.images[4]"
											type="text"
											placeholder="https://www.example.com/img.png"
											class="
												form-control
												mb-3
												bg-dark
												text-light
												border-secondary
											"
										>

										<BButton
											variant="outline-success"
											class="w-100"
											@click="updateProduct()"
										>Update</BButton>
									</BCol>
								</BRow>
							</BCardBody>
						</BCard>

						<BCard
							v-if="false"
							bg-variant="dark"
							border-variant="secondary"
							no-body
							class="mb-3"
							:class="{
								'border-warning border-dashed': edit.images
							}"
						>
							<!-- [HEADER] -->
							<BCardHeader>
								<BRow>
									<BCol md="7" cols="12">
										<h6 class="text-primary">Other Actions</h6>
									</BCol>
								</BRow>
							</BCardHeader>

							<!-- [PRODUCT][IMAGES] -->
							<BCardBody>
								<BRow>
									<!-- Other Actions -->
									<BCol cols="12">
										<BButton
											variant="success"
											class="w-100"
											size="sm"
										>+ Duplicate Product</BButton>
									</BCol>
								</BRow>
							</BCardBody>
						</BCard>
					</BCol>
					
					<!-- [MIDDLE] -->
					<BCol cols="12" lg="9" xl="6">
						<BRow>
							<BCol cols="12" md="7">
								<!-- [PRODUCT][NAME] -->
								<BCard
									bg-variant="dark"
									border-variant="secondary"
									no-body
									class="mb-3"
									:class="{
										'border-warning border-dashed': edit.name
									}"
								>
									<!-- [HEADER] -->
									<BCardHeader>
										<BRow>
											<!-- [TITLE] -->
											<BCol cols="7">
												<h5 class="m-0 text-primary">Name</h5>
											</BCol>
												
											<!-- [EDIT-BUTTON] -->
											<BCol cols="5" class="text-right">
												<BButton
													variant="primary"
													size="sm"
													class="w-100 p-0"
													style="max-width: 80px;"
													@click="edit.name = true"
												>Edit</BButton>
											</BCol>
										</BRow>
									</BCardHeader>

									<!-- [CONTENT] -->
									<BCardBody>
										<!-- [CURRENT] -->
										<h6 v-if="!edit.name" class="m-0">
											{{ product.name }}
										</h6>

										<!-- [EDIT] -->
										<div v-if="edit.name" class="input-group input-group-sm">
											<input
												v-model="product.name"
												type="text"
												class="
													form-control
													bg-dark
													text-light
													border-secondary
												"
											>
											<div class="input-group-append">
												<BButton

													variant="outline-success"
													class="w-100"
													@click="updateProduct()"
												>Update</BButton>
											</div>
										</div>
									</BCardBody>
								</BCard>
							</BCol>

							<!-- [PRODUCT][PRICE] -->
							<BCol cols="12" md="5">
								<!-- [PRODUCT][NAME] -->
								<BCard
									bg-variant="dark"
									border-variant="secondary"
									no-body
									class="mb-3"
									:class="{
										'border-warning border-dashed': edit.price
									}"
								>
									<!-- [HEADER] -->
									<BCardHeader>
										<BRow>
											<!-- [TITLE] -->
											<BCol cols="7">
												<h5 class="m-0 text-primary">Price</h5>
											</BCol>

											<!-- [EDIT-BUTTON] -->
											<BCol cols="5" class="text-right">
												<BButton
													variant="primary"
													size="sm"
													class="w-100 p-0"
													style="max-width: 80px;"
													@click="edit.price = true"
												>Edit</BButton>
											</BCol>
										</BRow>
									</BCardHeader>

									<!-- [CONTENT] -->
									<BCardBody>
										<!-- [CURRENT] -->
										<h6 v-if="!edit.price" class="m-0">
											${{ product.price.string }}
										</h6>

										<!-- [EDIT] -->
										<BRow v-if="edit.price">
											<BCol cols="5" class="pr-1">
												<input
													v-model="product.price.dollars"
													type="text"
													class="
														form-control
														form-control-sm
														bg-dark
														text-light
														border-secondary
														mb-3
													"
												>
											</BCol>

											<BCol cols="1" class="p-0 text-center">
												<h6 class="m-0 pt-3">.</h6>
											</BCol>

											<BCol cols="6" class="pl-1">
												<input
													v-model="product.price.cents"
													type="text"
													class="
														form-control
														form-control-sm
														bg-dark
														text-light
														border-secondary
														mb-3
													"
												>
											</BCol>

											<BCol cols="12">
												<div class="input-group-append">
													<BButton
														size="sm"
														variant="outline-success"
														class="w-100"
														@click="updateProduct()"
													>Update</BButton>
												</div>
											</BCol>
										</BRow>
									</BCardBody>
								</BCard>
							</BCol>

							<BCol cols="12">
								<!-- [PRODUCT][REQUIRED-PRODUCT-ADDITIONS] -->
								<BCard
									bg-variant="dark"
									border-variant="secondary"
									no-body
									class="mb-3"
									:class="{
										'border-warning border-dashed': edit.requiredProductOptions
									}"
								>
									<BCardHeader>
										<!-- [HEADER] -->
										<BRow>
											<!-- [TITLE] -->
											<BCol cols="7">
												<h5 class="m-0 text-primary">
													Required Product Options
												</h5>
											</BCol>

											<!-- [EDIT-BUTTON] -->
											<BCol cols="5" class="text-right">
												<BButton
													v-if="!edit.requiredProductOptions"
													variant="primary"
													size="sm"
													class="w-100 p-0"
													style="max-width: 80px;"
													@click="edit.requiredProductOptions = true"
												>Edit</BButton>

												<BButton
													v-if="edit.requiredProductOptions"
													variant="danger"
													class="w-100 p-0"
													size="sm"
													style="max-width: 80px;"
													@click="edit.requiredProductOptions = false"
												>Cancel</BButton>
											</BCol>
										</BRow>
									</BCardHeader>

									<!-- [CONTENT] -->
									<BCardBody>
										<BRow>
											<!-- [CURRENT] -->
											<BCol cols="12">
												<BListGroup>
													<BListGroupItem
														v-for="(pa, i) in product.requiredProductOptions"
														:key="i"
														variant="none"
														class="text-light py-2 border-secondary transparent"
													>
														<BRow>
															<BCol cols="10">
																<h6 class="mx-0 my-1">
																	{{ pa.name }}
																</h6>
															</BCol>

															<BCol
																v-if="edit.requiredProductOptions"
																cols="2"
															>
																<BButton
																	size="sm"
																	variant="outline-danger"
																	class="w-100 py-0"
																	@click="removeRequiredPA(pa)"
																>X</BButton>
															</BCol>
														</BRow>
													</BListGroupItem>

													<BListGroupItem
														v-if="edit.requiredProductOptions"
														variant="none"
														class="text-light py-2 border-secondary transparent"
													>
														<!-- [EDIT] -->
														<BRow>
															<BCol cols="12">
																<!-- [SELECT] -->
																<div class="mx-0 my-1 input-group input-group-sm">
																	<select
																		v-model="selectedRequiredProductOption"
																		class="
																			form-control
																			text-light
																			border-success
																			bg-dark
																		"
																	>
																		<option disabled value="">
																			Choose a Product Option to Add
																		</option>
																		<option
																			v-for="pa in productOptions"
																			:key="pa._id"
																			:value="pa"
																		>{{ pa.name }}</option>
																	</select>

																	<div class="input-group-append">
																		<!-- [ADD] -->
																		<BButton
																			variant="outline-success"
																			class="w-100"
																			@click="addRequiredPA()"
																		>+ Add PO</BButton>
																	</div>
																</div>
															</BCol>
														</BRow>
													</BListGroupItem>
												</BListGroup>
											</BCol>

											<!-- [NONE] -->
											<BCol
												v-if="
													!edit.requiredProductOptions &&
													product.requiredProductOptions.length == 0
												"
											>
												<h6 class="m-0 text-secondary">
													No Required Product Options
												</h6>
											</BCol>
										</BRow>
									</BCardBody>
								</BCard>
							</BCol>

							<BCol cols="12">
								<!-- [PRODUCT][OPTIONAL-PRODUCT-ADDITIONS] -->
								<BCard
									bg-variant="dark"
									border-variant="secondary"
									no-body
									class="mb-3"
									:class="{
										'border-warning border-dashed': edit.optionalProductOptions
									}"
								>
									<!-- [HEADER] -->
									<BCardHeader>
										<BRow>
											<BCol cols="7">
												<h5 class="m-0 text-primary">
													Optional Product Options
												</h5>
											</BCol>

											<!-- [EDIT-BUTTON] -->
											<BCol cols="5" class="text-right">
												<BButton
													v-if="!edit.optionalProductOptions"
													variant="primary"
													size="sm"
													class="w-100 p-0"
													style="max-width: 80px;"
													@click="edit.optionalProductOptions = true"
												>Edit</BButton>

												<BButton
													v-if="edit.optionalProductOptions"
													variant="danger"
													size="sm"
													class="w-100 p-0"
													style="max-width: 80px;"
													@click="edit.optionalProductOptions = false"
												>Cancel</BButton>
											</BCol>
										</BRow>
									</BCardHeader>

									<!-- [CONTENT] -->
									<BCardBody>
										<BRow>
											<!-- [CURRENT] -->
											<BCol cols="12">
												<BListGroup>
													<BListGroupItem
														v-for="(pa, i) in product.optionalProductOptions"
														:key="i"
														variant="none"
														class="text-light py-2 border-secondary transparent"
													>
														<BRow>
															<BCol cols="9">
																<h6 class="mx-0 my-1">
																	{{ pa.name }}
																</h6>
															</BCol>

															<BCol
																v-if="edit.optionalProductOptions"
																cols="3"
															>
																<BButton
																	size="sm"
																	variant="danger"
																	class="w-100 py-0"
																	@click="removeOptionalPA(pa)"
																>Delete</BButton>
															</BCol>
														</BRow>
													</BListGroupItem>

													<BListGroupItem
														v-if="edit.optionalProductOptions"
														variant="none"
														class="text-light py-2 border-secondary transparent"
													>
														<!-- [EDIT] -->
														<BRow>
															<!-- [SELECT] -->
															<BCol cols="12">
																<div class="my-1 input-group input-group-sm">
																	<select
																		v-model="selectedOptionalProductOption"
																		class="
																			form-control
																			text-light
																			border-success
																			bg-dark
																		"
																	>
																		<option disabled value="">
																			Choose a Product Option to Add
																		</option>
																		<option
																			v-for="pa in productOptions"
																			:key="pa._id"
																			:value="pa"
																		>{{ pa.name }}</option>
																	</select>

																	<div class="input-group-append">
																		<!-- [ADD] -->
																		<BButton
																		variant="outline-success"
																		class="w-100"
																		@click="addOptionalPA()"
																	>+ Add PO</BButton>
																	</div>
																</div>
															</BCol>
														</BRow>
													</BListGroupItem>
												</BListGroup>
											</BCol>

											<!-- [NONE] -->
											<BCol
												v-if="!edit.optionalProductOptions &&
												product.optionalProductOptions.length == 0"
												cols="12"
											>
												<h6 class="m-0 text-secondary">
													No Optional Product Options
												</h6>
											</BCol>
										</BRow>
									</BCardBody>
								</BCard>
							</BCol>

							<BCol cols="12">
								<!-- [PRODUCT][DESCRIPTION] -->
								<BCard
									bg-variant="dark"
									border-variant="secondary"
									no-body
									class="mb-3"
									:class="{
										'border-warning border-dashed': edit.description
									}"
								>
									<BCardHeader>
										<!-- [HEADER] -->
										<BRow>
											<!-- [TITLE] -->
											<BCol cols="7">
												<h5 class="m-0 text-primary">Description</h5>
											</BCol>

											<!-- [EDIT-BUTTON] -->
											<BCol cols="5" class="text-right">
												<BButton
													variant="primary"
													size="sm"
													class="w-100 p-0"
													style="max-width: 80px;"
													@click="edit.description = true"
												>Edit</BButton>
											</BCol>
										</BRow>
									</BCardHeader>

									<!-- [CONTENT] -->	
									<BCardBody>
										<!-- [CURRENT] -->
										<h6 v-if="!edit.description" class="m-0">
											{{ product.description }}
										</h6>

										<h6
											v-if="!edit.description && !product.description"
											class="m-0 text-secondary"
										>No Description</h6>

										<!-- [EDIT] -->
										<div
											v-if="edit.description"
											class="input-group input-group-sm"
										>
											<input
												v-model="product.description"
												type="text"
												class="
													form-control
													bg-dark
													text-light
													border-secondary
												"
											>
											<div class="input-group-append">
												<BButton
													variant="outline-success"
													class="w-100"
													@click="updateProduct()"
												>Update</BButton>
											</div>
										</div>
									</BCardBody>
								</BCard>
							</BCol>
						</BRow>
					</BCol>

					<!-- [RIGHT] -->
					<BCol cols="12" xl="3">
						<BCard
							bg-variant="dark"
							border-variant="secondary"
							no-body
							class="mb-3"
							:class="{
								'border-warning border-dashed': edit.categories
							}"
						>
							<!-- [PRODUCT][CATEGORY] -->
							<BCardHeader>
								<!-- [HEDAER] -->
								<BRow>
									<!-- [TITLE] -->
									<BCol cols="7">
										<h5 class="m-0 text-primary">Category</h5>
									</BCol>
									
									<!-- [EDIT-BUTTON] -->
									<BCol cols="5" class="text-right">
										<BButton
											variant="primary"
											size="sm"
											class="w-100 p-0"
											style="max-width: 80px;"
											@click="edit.categories = true"
										>Edit</BButton>
									</BCol>
								</BRow>
							</BCardHeader>

							<!-- [CONTENT] -->
							<BCardBody>
								<!-- [CURRENT] -->
								<h6 v-if="!edit.categories" class="m-0">
									{{ product.categories[0] }}
								</h6>

								<h6
									v-if="!edit.categories && !product.categories[0]"
									class="m-0 text-secondary"
								>No Category</h6>

								<!-- [EDIT] -->
								<div
									v-if="edit.categories"
									class="input-group input-group-sm"
								>
									<input
										v-model="product.categories[0]"
										type="text"
										class="
											form-control
											bg-dark
											text-light
											border-secondary
										"
									>
									<div class="input-group-append">
										<BButton
											variant="outline-success"
											class="w-100"
											@click="updateProduct()"
										>Update</BButton>
									</div>
								</div>
							</BCardBody>
						</BCard>
					</BCol>
				</BRow>
			</BCardBody>

			<BCardBody v-if="loading || error">
				<!-- [LOADING] -->
				<BRow v-if="loading">
					<BCol cols="12">
						Loading..
					</BCol>
				</BRow>

				<!-- [ERROR] -->
				<BRow v-if="error">
					<BCol cols="12">
						<h6 class="text-danger">{{ error }}</h6>
					</BCol>
				</BRow>
			</BCardBody>
		</BCard>
	</BContainer>
</template>

<script>
// [IMPORT]
import axios from "axios";
import { ArrowLeftCircleIcon } from "vue-feather-icons";

// [IMPORT] Personal
import Confirm from "@/components/popups/Confirm";
import Alert from "@/components/inform/Alert";
import router from "@/router";

export default {
	data() {
		return {
			// [AUTH-AXIOS]
			authAxios: axios.create({
				baseURL: "/api/product",
				headers: {
					user_authorization: `Bearer ${localStorage.usertoken}`
				}
			}),
			loading: true,
			error: "",
			message: "We do not support uploading images yet. please provide a URL for images.",
			product: {},
			productOptions: [],
			focusedImg: 0,
			selectedRequiredProductOption: null,
			selectedOptionalProductOption: null,
			showConfirm: false,
			edit: {
				name: false,
				price: false,
				description: false,
				images: false,
				categories: false,
				requiredProductOptions: false,
				optionalProductOptions: false,
			},
		}
	},

	components: {
		ArrowLeftCircleIcon,
		Confirm,
		Alert,
	},

	methods: {
		async updateProduct() {
			// [INIT]
			let requiredProductOptions = [];
			let optionalProductOptions = [];

			// [HIDE]
			this.edit = {
				name: false,
				price: false,
				description: false,
				images: false,
				categories: false,
				requiredProductOptions: false,
				optionalProductOptions: false,
			};
			
			// [REQUIRED-PRODUCT-ADDITIONS]
			for (let i = 0; i < this.product.requiredProductOptions.length; i++) {
				const rpa = this.product.requiredProductOptions[i];
				
				requiredProductOptions.push(rpa._id);
			}

			this.product.requiredProductOptions = requiredProductOptions;

			// [OPTIONAL-PRODUCT-ADDITIONS]
			for (let i = 0; i < this.product.optionalProductOptions.length; i++) {
				const rpa = this.product.optionalProductOptions[i];
				
				optionalProductOptions.push(rpa._id);
			}

			this.product.optionalProductOptions = optionalProductOptions;


			const resData = (
				await this.authAxios.post("/update", { product: this.product })
			).data;


			if (resData.status) { this.product = resData.updatedProduct; }
			else { this.error = resData.message; }
		},

		async addRequiredPA() {
			if (this.selectedRequiredProductOption) {
				this.product.requiredProductOptions.push(
					this.selectedRequiredProductOption
				);

				await this.updateProduct();
			}
			else { this.error = "You must select a Product Option"; }
		},

		async addOptionalPA() {
			if (this.selectedOptionalProductOption) {
				this.product.optionalProductOptions.push(
					this.selectedOptionalProductOption
				);

				await this.updateProduct();
			}
			else { this.error = "You must select a Product Option"; }
		},
		
		async removeRequiredPA(pa) {
			const i = this.product.requiredProductOptions.indexOf(pa);
			
			if (i > -1) {
				this.product.requiredProductOptions.splice(i, 1);
			}

			await this.updateProduct();
		},

		async removeOptionalPA(pa) {
			const i = this.product.optionalProductOptions.indexOf(pa);
			
			if (i > -1) {
				this.product.optionalProductOptions.splice(i, 1);
			}

			await this.updateProduct();
		},

		async deleteProduct() {
			const resData = (
				await this.authAxios.post("/delete-one", {
					product_id: this.product._id
				})
			).data;


			this.showConfirm = false;

			if (resData.status) {
				router.push("/dashboard/product/0/5/1");
			}
		},
	},

	async created() {
		this.loading = true;

		const resData = (
			await this.authAxios.post("/find-one", {
				product_id: this.$route.params.product_id
			})
		).data;

		if (resData.status) {
			this.product = resData.product;
			this.productOptions = resData.productOptions;
		}
		else { this.error = resData.message; }

		this.loading = false;
	},
}
</script>

<style lang="scss" scoped>
	.transparent {
		background-color: rgba(255, 255, 255, 0) !important;
	}

	
	.carousel-img img {
		width: 100%;
		height: 150px;
	}

</style>