<template>
	<BCard
		bg-variant="dark"
		border-variant=""
		text-variant="light"
		class="shadow"
	>
		<BRow>
			<BCol cols="12">
				<h4 class="text-primary">Your Card on File</h4>
				<h6 class="small text-secondary">
					This is the card that will be charged for a paid subscription and any furher transactions.
				</h6>
				<hr>
			</BCol>

			<BCol cols="12" md="8">
				<!-- Card Brand -->
				<h4 v-if="brand">{{ brand }} - **** {{ last4 }}</h4>
				<h4 v-else>No Card Attached</h4>

				<!-- Card Exp -->
				<h5 v-if="exp_month" class="text-muted">
					Exp: {{ exp_month }}/{{ exp_year }}
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
									v-model="reqData_updatePaymentMethod.card"
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
						<h6 class="m-0 font-weight-bold text-danger">{{ error }}</h6>
					</BCol>
				</Brow>
			</BCol>
		</BRow>
	</BCard>
</template>

<script>
	import VueCreditCard from '@fracto/vue-credit-card'

	import SubscriptionService from '@/services/ApiSubscriptionService'

	export default {
		props: {
			brand: {
				default: '',
				type: String,
			},

			last4: {
				default: '',
				type: String,
			},

			exp_month: {
				default: null,
				type: String,
			},

			exp_year: {
				default: null,
				type: String,
			},
		},

		data() {
			return {
				showCardUpdater: false,

				resData: {},

				reqData_updatePaymentMethod: {
					card: {
						holder: '',
						number: '',
						month: '',
						year: '',
						cvv: '',
					},
				},

				loading: true,
				error: '',
			}
		},

		components: {
			VueCreditCard,
		},

		methods: {
			async updatePaymentMethod() {
				this.loading = true

				this.resData = await SubscriptionService.s_update_pm({
					cardName: this.reqData_updatePaymentMethod.card.holder,
					cardNumber: this.reqData_updatePaymentMethod.card.number,
					cardMonth: this.reqData_updatePaymentMethod.card.month,
					cardYear: this.reqData_updatePaymentMethod.card.year,
					cardCvc: this.reqData_updatePaymentMethod.card.cvv,
				})

				if (this.resData.status) {
					this.showCardUpdater = false
					
					this.$emit('refreshData')
				}
				else { this.error = this.resData.message }

				this.loading = false
			},

			async deletePaymentMethod() {
				this.loading = true

				this.resData = await SubscriptionService.s_delete_pm()

				if (this.resData.status) {
					this.showCardUpdater = false
					
					this.$emit('refreshData')
				}
				else { this.error = this.resData.message }

				this.loading = false
			},
		},

		async created() {
			this.loading = false
		},
	}
</script>