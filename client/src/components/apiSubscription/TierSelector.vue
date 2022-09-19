<template>
	<BCard
		bg-variant="dark"
		border-variant=""
		no-body
		class="shadow"
	>
		<BCardHeader>
			<BRow>
				<BCol cols="12">
					<h4 class="text-primary">Your Current API Subscrition Tier</h4>
					<h6 class="small text-secondary">
						If Silver or Gold plan is chosen, you will have 24 hours to downgrade to bronze without being charged.
					</h6>
				</BCol>
			</BRow>
		</BCardHeader>

		<BCardBody v-if="!loading">
			<BRow>
				<BCol cols="12" sm="6" class="mb-3">
					<div class="border border-success" style="border-width: 2px !important;">
						<h6 class="m-1 small text-center text-secondary">Active</h6>
					</div>
				</BCol>

				<BCol cols="12" sm="6" class="mb-3">
					<div class="border-dashed border-success" style="border-width: 2px !important;">
						<h6 class="m-1 small text-center text-secondary">Wil be canceled by end-of-period</h6>
					</div>
				</BCol>

				<BCol cols="12" sm="6" md="4">
					<BCard
						bg-variant="dark"
						border-variant="success"
						no-body
						class="rounded-lg my-4"
						style="border-width: 2px;"
					>
						<BCardHeader>
							<h2 class="my-2 text-center" style="color: #CD7F32;">
								BRONZE
							</h2>
						</BCardHeader>

						<BCardBody>
							<h3 class="m-0 text-center text-success">Free</h3>
						</BCardBody>

						<BCardFooter>
							<BButton
								variant="success"
								class="w-100 my-3"
								@click="promptChangeTier(0)"
							>
								Select
							</BButton>
						</BCardFooter>
					</BCard>
				</BCol>

				<BCol cols="12" sm="6" md="4">
					<BCard
						bg-variant="dark"
						no-body
						:border-variant="this.$store.state.apiSubscription.stripe.subscription.tier1.subId !== '' ? 'success' : ''"
						class="rounded-lg my-4"
						:class="this.$store.state.apiSubscription.stripe.subscription.tier1.cancelAtPeriodEnd ? 'border-dashed' : ''"
						style="border-width: 2px;"
					>
						<BCardHeader>
							<h2 class="my-2 text-center" style="color: #C0C0C0;">
								SILVER
							</h2>
						</BCardHeader>

						<BCardBody>
							<h3 class="m-0 text-center text-success">
								${{ tier1Price }}<span class="small">/mo</span>
							</h3>
						</BCardBody>

						<BCardFooter>
							<BButton
								variant="success"
								class="w-100 my-3"
								@click="promptChangeTier(1)"
							>
								Select
							</BButton>
						</BCardFooter>
					</BCard>
				</BCol>

				<BCol cols="12" sm="6" md="4">
					<BCard
						bg-variant="dark"
						no-body
						:border-variant="this.$store.state.apiSubscription.stripe.subscription.tier2.subId !== '' ? 'success' : ''"
						class="rounded-lg my-4"
						:class="this.$store.state.apiSubscription.stripe.subscription.tier2.cancelAtPeriodEnd ? 'border-dashed' : ''"
						style="border-width: 2px;"
					>
						<BCardHeader>
							<h2 class="my-2 text-center" style="color: #FFD700;">
								GOLD
							</h2>
						</BCardHeader>

						<BCardBody>
							<h3 class="m-0 text-center text-success">
								${{ tier2Price }}<span class="small">/mo</span>
							</h3>
						</BCardBody>

						<BCardFooter>
							<BButton
								variant="success"
								class="w-100 my-3"
								@click="promptChangeTier(2)"
							>
								Select
							</BButton>
						</BCardFooter>
					</BCard>
				</BCol>
			</BRow>
		</BCardBody>

		<BCardBody v-if="error">
			<BRow>
				<BCol cols="12">
					<h6 class="my-3 text-danger">{{ error }}</h6>
				</BCol>
			</BRow>
		</BCardBody>

		<BCardBody v-if="loading">
			<BRow>
				<BCol cols="12">
					<h6 class="my-5 text-center text-warning">Loading..</h6>
				</BCol>
			</BRow>
		</BCardBody>

		<Confirm
			v-if="showConfirm"
			@xClicked="showConfirm = false"
			@yesClicked="updateTier()"
			@noClicked="showConfirm = false"
		/>
	</BCard>
</template>

<script>
	import Confirm from '@/components/popups/Confirm'
	import ApiSubscriptionService from '../../services/ApiSubscriptionService'

	export default {
		props: {
			tier1Price: {
				type: Number,
				required: true,
			},

			tier2Price: {
				type: Number,
				required: true,
			},
		},

		data() {
			return {
				loading: true,
				disableButtons: false,
				showConfirm: false,

				changeToTier: 0,

				resData_updateTier: {
					tier: '',
				},

				error: '',
			}
		},

		methods: {
			promptChangeTier(x) {
				this.changeToTier = x
				this.showConfirm = true
			},

			async updateTier() {
				this.showConfirm = false;
				
				this.loading = true;

				this.disableButtons = true;

				const resData = await ApiSubscriptionService.s_update_tier({
					tier: this.changeToTier
				});

				if (resData.status) {
					this.changeCard = false;
					
					this.$store.state.apiSubscription = resData.apiSubscription;
				}
				else { this.error = resData.message; }

				this.loading = false;
				
				this.disableButtons = false;
			},
		},

		components: {
			Confirm,
		},

		created() {
			this.loading = false
		},
	}
</script>