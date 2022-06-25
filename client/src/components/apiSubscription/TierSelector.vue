<template>
	<BCard
		bg-variant="dark"
		border-variant=""
		class="shadow"
	>
		<BRow>
			<BCol cols="12">
				<h4 class="text-primary">Your Current API Subscrition Tier</h4>
				<h6 class="small text-secondary">
					If Silver or Gold plan is chosen, you will have 24 hours to downgrade to bronze without being charged.
				</h6>
				<hr>
			</BCol>
		</BRow>

		<BRow v-if="!loading">
			<BCol cols="12" sm="6" md="4">
				<BCard
					bg-variant="dark"
					:border-variant="apiSubscriptionTier == 0 ? 'primary': ''"
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
							:disabled="apiSubscriptionTier == 0 || disableButtons"
							class="w-100 my-3"
							@click="promptChangeTier(0)"
						>
							{{ apiSubscriptionTier == 0 ? 'Current' : 'Select' }}
						</BButton>
					</BCardFooter>
				</BCard>
			</BCol>

			<BCol cols="12" sm="6" md="4">
				<BCard
					bg-variant="dark"
					no-body
					:border-variant="apiSubscriptionTier == 1 ? 'primary' : ''"
					class="rounded-lg my-4"
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
							:disabled="apiSubscriptionTier == 1 || disableButtons"
							class="w-100 my-3"
							@click="promptChangeTier(1)"
						>
							{{ apiSubscriptionTier == 1 ? 'Current' : 'Select' }}
						</BButton>
					</BCardFooter>
				</BCard>
			</BCol>

			<BCol cols="12" sm="6" md="4">
				<BCard
					bg-variant="dark"
					no-body
					:border-variant="apiSubscriptionTier == 2 ? 'primary' : ''"
					class="rounded-lg my-4"
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
							:disabled="apiSubscriptionTier == 2 || disableButtons"
							class="w-100 my-3"
							@click="promptChangeTier(2)"
						>
							{{ apiSubscriptionTier == 2 ? 'Current' : 'Select' }}
						</BButton>
					</BCardFooter>
				</BCard>
			</BCol>
		</BRow>

		<BRow v-if="error">
			<BCol cols="12">
				<h6 class="my-3 text-danger">{{ error }}</h6>
			</BCol>
		</BRow>

		<BRow v-if="loading">
			<BCol cols="12">
				<h6 class="my-5 text-center text-warning">Loading..</h6>
			</BCol>
		</BRow>

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
	import SubscriptionService from '@/services/ApiSubscriptionService'

	export default {
		props: {
			apiSubscriptionTier: {
				type: Number,
				required: true,
			},

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

				resData: {},

				reqData_updateTier: {
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
				this.showConfirm = false
				
				this.loading = true
				this.disableButtons = true

				this.resData = await SubscriptionService.s_update_tier({
					tier: this.changeToTier
				})

				if (this.resData.status) {
					this.changeCard = false
					
					this.$emit('refreshData')
				}
				else { this.error = this.resData.message }

				this.loading = false
				this.disableButtons = false
			},
		},

		components: {
			Confirm,
		},

		created() {
			this.loading = false
			this.reqData_updateTier.tier = this.apiSubscriptionTier
		},
	}
</script>