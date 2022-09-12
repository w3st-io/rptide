<template>
	<BContainer class="py-5">
		<BRow>
			<!-- User Not Verifed -->
			<BCol v-if="!isVerified" cols="12">
				<BCard bg-variant="danger" class="mb-3">
					<h5 class="text-center text-light">Account Not Verified!</h5>
					<BButton
						variant="outline-light"
						class="w-100"
						@click="resendvCodeEmail()"
					>Click to Resend Email</BButton>
				</BCard>
			</BCol>

			<!-- Email Sent -->
			<BCol v-if="vCodeSent" cols="12" class="mb-3">
				<BCard bg-variant="success" class="m-auto">
					<h5 class="text-center text-light">Email Sent!</h5>
				</BCard>
			</BCol>
		</BRow>
		
		<div v-if="!error && !loading">
			<BRow>
				<!-- Account Details -->
				<BCol cols="12">
					<h2 class="mb-5 text-primary">Your Account</h2>
				</BCol>

				<BCol cols="12">
					<MyCard
						:brand="this.currentCard.brand"
						:last4="this.currentCard.last4"
						:exp_month="this.currentCard.exp_month"
						:exp_year="this.currentCard.exp_year"
						@refreshData="getPageData()"
						class="mb-5"
					/>
				</BCol>

				<BCol cols="12">
					<TierSelector
						@refreshData="getPageData()"
						:apiSubscriptionTier="apiSubscriptionTier"
						class="mb-5"
						:tier1Price="tier1Price"
						:tier2Price="tier2Price"
					/>
				</BCol>

				<BCol cols="12">
					<BCard
						bg-variant="dark"
						class="shadow"
					>
						<APIKeys />
					</BCard>
				</BCol>
			</BRow>
		</div>

		<!-- Update Password -->
		<UpdatePassword v-if="!loading" />

		<BRow v-if="loading">
			<!-- [LOADING] -->
			<BCol cols="12">
				<h6 class="text-warning">Loading..</h6>
			</BCol>
		</BRow>

		<BRow v-if="error">
			<!-- [ERROR] -->
			<BCol cols="12">
				<h6 class="m-0 font-weight-bold text-danger">{{ error }}</h6>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT]
	import axios from 'axios'

	// [IMPORT] Personal
	import APIKeys from '../../components/apiSubscription/APIKeys.vue'
	import TierSelector from '../../components/apiSubscription/TierSelector'
	import MyCard from '../../components/stripe/MyCard'
	import router from '../../router'
	import Service from '../../services'
	import UpdatePassword from '../../components/user/UpdatePassword.vue'

	export default {
		data() {
			return {
				// [AUTH-AXIOS]
				authAxios: axios.create({
					baseURL: '/pages/user/index',
					headers: {
						user_authorization: `Bearer ${localStorage.usertoken}`
					}
				}),

				resData: {},
				loading: true,
				error: '',

				currentCard: {
					brand: '',
					last4: '',
					exp_month: '',
					exp_year: '',
				},

				user: {},

				apiSubscriptionTier: 0,

				tier1Price: 0,
				tier2Price: 0,

				data: {},

				isVerified: true,
				vCodeSent: false,
			}
		},

		components: {
			APIKeys,
			MyCard,
			TierSelector,
			UpdatePassword,
		},

		methods: {
			async getPageData() {
				this.loading = true

				this.resData = (
					await this.authAxios.get(`/`)
				).data
				
				if (this.resData.status) {
					this.data = this.resData
					
					// user
					this.user = this.resData.user
					this.isVerified = this.user.verified

					// apiSubscriptionTier
					this.apiSubscriptionTier = this.resData.apiSubscriptionTier

					// currentCard
					if (this.resData.paymentMethod) {
						this.currentCard.brand = this.resData.paymentMethod.card.brand
						this.currentCard.last4 = this.resData.paymentMethod.card.last4
						this.currentCard.exp_month = this.resData.paymentMethod.card.exp_month
						this.currentCard.exp_year = this.resData.paymentMethod.card.exp_year
					}
					else {
						this.currentCard.brand = ''
						this.currentCard.last4 = ''
						this.currentCard.exp_month = ''
						this.currentCard.exp_year = ''
					}

					// price
					this.tier1Price = this.resData.tier1Price
					this.tier2Price = this.resData.tier2Price
				}
				else {
					this.error = this.resData.message
					this.currentCard = {}
				}

				this.loading = false
			},

			async resendvCodeEmail() {
				if (this.user) {
					this.resData = await Service.s_resendVerificationEmail(
						this.user.email
					)

					if (this.resData.status) { this.vCodeSent = true }
					else { this.error = this.resData.message }
				}
			},

			redirectPasswordChange() { router.push({ name: 'password_change', }) },
		},

		async created() {
			try {
				// [REDIRECT] Not Log Required
				if (!localStorage.usertoken) { router.push({ name: 'user_login' }) }

				await this.getPageData()
			}
			catch (err) { this.error = err }
		},
	}
</script>