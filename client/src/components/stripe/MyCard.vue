<template>
	<BCard
		bg-variant="dark"
		border-variant="secondary"
		text-variant="light"
		no-body
		class="shadow"
	>
		<BCardHeader class="border-secondary">
			<BRow>
				<BCol cols="12">
					<h4 class="text-primary">Your Card on File</h4>
					<h6 class="small text-secondary">
						This is the card that will be charged for a paid subscription and any furher transactions.
					</h6>
				</BCol>
			</BRow>
		</BCardHeader>
		
		<BCardBody>
			<BRow>
				<BCol cols="12" md="8">
					<!-- Card Brand -->
					<h4 v-if="this.$store.state.currentCard.brand">
						{{ this.$store.state.currentCard.brand }} -
						**** {{ this.$store.state.currentCard.last4 }}
					</h4>
					<h4 v-else>No Card Attached</h4>

					<!-- Card Exp -->
					<h5
						v-if="this.$store.state.currentCard.exp_month"
						class="text-muted"
					>
						Exp:
						{{ this.$store.state.currentCard.exp_month }}
						/
						{{ this.$store.state.currentCard.exp_year }}
					</h5>
				</BCol>

				<BCol cols="12" md="2">
					<BButton
						v-if="!showCardUpdater"
						variant="success"
						class="w-100 mb-3"
						size="sm"
						@click="showCardUpdater = true"
					>Update</BButton>
				</BCol>

				<BCol cols="12" md="2">
					<BButton
						v-if="!showCardUpdater"
						:disabled="loading"
						variant="danger"
						class="w-100"
						size="sm"
						@click="deletePaymentMethod()"
					>Delete</BButton>
				</BCol>

				<!-- UPDATE CARD -->
				<BCol cols="12">
					<BRow
						v-if="showCardUpdater"
						class="my-3 py-3 rounded-lg border-warning"
						style="border-style: dashed !important; border-width: 3px;"
					>
						<BCol cols="12">
							<BRow  class="text-light">
								<BCol cols="12" md="9">
									<h5 class="text-warning mb-3 mb-md-0">
										Enter Your New Card Details
									</h5>
								</BCol>

								<BCol cols="12" md="3">
									<BButton
										variant="outline-danger"
										class="w-100"
										size="sm"
										@click="showCardUpdater = false"
									>Cancel</BButton>
								</BCol>
							</BRow>
						</BCol>

						<BCol cols="12">
							<BRow class="text-light">
								<BCol cols="12">
									<VueCreditCard
										v-model="toBeUpdatedPaymentMethod.card"
										:preview-enabled="false"
										class="my-5 font"
									/>
								</BCol>
							</BRow>
						</BCol>

						<BCol cols="12" order="2">
							<BButton
								:disabled="loading"
								variant="success"
								class="w-100"
								size="sm"
								@click="updatePaymentMethod()"
							>Submit</BButton>
						</BCol>


						<!-- [ERROR] -->
						<BCol v-if="error" cols="12">
							<h6 class="m-0 font-weight-bold text-danger">
								Error: {{ error }}
							</h6>
						</BCol>
					</Brow>
				</BCol>
			</BRow>
		</BCardBody>
	</BCard>
</template>

<script>
	// [IMPORT]
	import axios from 'axios';
	import VueCreditCard from '@fracto/vue-credit-card';

	export default {
		data() {
			return {
				// [AUTH-AXIOS]
				authAxios: axios.create({
					baseURL: '/api/user',
					headers: {
						user_authorization: `Bearer ${localStorage.usertoken}`
					}
				}),

				loading: true,
				error: '',
				showCardUpdater: false,

				toBeUpdatedPaymentMethod: {
					card: {
						holder: '',
						number: '',
						month: '',
						year: '',
						cvv: '',
					},
				},
			}
		},

		components: {
			VueCreditCard
		},

		methods: {
			async updatePaymentMethod() {
				this.loading = true;

				const resData = (
					await this.authAxios.post(
						'/stripe-payment-method-update',
						{
							cardName: this.toBeUpdatedPaymentMethod.card.holder,
							cardNumber: this.toBeUpdatedPaymentMethod.card.number,
							cardMonth: this.toBeUpdatedPaymentMethod.card.month,
							cardYear: this.toBeUpdatedPaymentMethod.card.year,
							cardCvc: this.toBeUpdatedPaymentMethod.card.cvv
						}
					)
				).data;

				if (resData.status) {
					this.showCardUpdater = false;
					
					this.$store.state.currentCard = resData.card;
				}
				else {
					this.error = resData.message;
				}

				this.loading = false;
			},

			async deletePaymentMethod() {
				this.loading = true

				const resData = (
					await this.authAxios.post('/stripe-payment-method-delete')
				).data;

				if (resData.status) {
					this.showCardUpdater = false;
					
					this.$store.state.currentCard = {
						brand: "",
						last4: "",
						exp_month: null,
						exp_year: null,
					};
				}
				else { this.error = resData.message; }

				this.loading = false;
			},
		},

		async created() {
			const resData = (await this.authAxios.post('/stripe-payment-method')).data

			this.$store.state.currentCard = resData.paymentMethod.card;
			
			this.loading = false;
		}
	}
</script>